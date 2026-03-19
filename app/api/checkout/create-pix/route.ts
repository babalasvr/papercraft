import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { createPixPayment } from '@/app/lib/expfy';
import { sendMetaEventWithName } from '@/app/lib/meta-conversions';
import { CHECKOUT_PRODUCTS, ORDER_BUMP, ORDER_BUMP_WHATSAPP, calculateTotal } from '@/app/lib/checkout-products';
import { validateCPF, validateEmail, validatePhone, validateName, cleanCPF, cleanPhone } from '@/app/lib/validators';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, email, cpf, phone,
      productId, orderBumps = [],
      utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
      metaEventId, fbc, fbp,
    } = body;

    // Validate inputs
    if (!validateName(name)) {
      return NextResponse.json({ error: 'Nome completo é obrigatório' }, { status: 400 });
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }
    if (!validateCPF(cpf)) {
      return NextResponse.json({ error: 'CPF inválido' }, { status: 400 });
    }
    if (!validatePhone(phone)) {
      return NextResponse.json({ error: 'Telefone inválido' }, { status: 400 });
    }

    const product = CHECKOUT_PRODUCTS[productId];
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 400 });
    }

    const cleanedCpf = cleanCPF(cpf);
    const cleanedPhone = cleanPhone(phone);
    const normalizedEmail = email.toLowerCase().trim();
    const total = calculateTotal(product, orderBumps);
    const externalId = randomUUID();

    // Capture client info for Meta CAPI
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || null;
    const clientUserAgent = request.headers.get('user-agent') || null;

    // Build order bumps data
    const orderBumpsData = [
      ...(orderBumps.includes('kit-impressao') ? [{ id: ORDER_BUMP.id, name: ORDER_BUMP.name, amount: ORDER_BUMP.priceInCents }] : []),
      ...(orderBumps.includes('kit-whatsapp') ? [{ id: ORDER_BUMP_WHATSAPP.id, name: ORDER_BUMP_WHATSAPP.name, amount: ORDER_BUMP_WHATSAPP.priceInCents }] : []),
    ];

    // Check for existing pending order (idempotency)
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('product_id', productId)
      .eq('status', 'pending')
      .gte('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
      .limit(1);

    if (existingOrder && existingOrder.length > 0) {
      // Já existe pedido pendente recente para esse email+produto — bloqueia duplicata
      return NextResponse.json(
        { error: 'Já existe um pagamento pendente para este produto. Aguarde ou use o PIX gerado anteriormente.' },
        { status: 409 }
      );
    }

    // Insert order in Supabase
    const { error: insertError } = await supabase.from('orders').insert({
      email: normalizedEmail,
      name: name.trim(),
      cpf: cleanedCpf,
      phone: cleanedPhone,
      product_id: productId,
      product_name: product.name,
      amount: total,
      payment_method: 'pix',
      external_id: externalId,
      status: 'pending',
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      utm_term: utmTerm || null,
      utm_content: utmContent || null,
      meta_event_id: metaEventId || null,
      fbc: fbc || null,
      fbp: fbp || null,
      client_ip: clientIp,
      client_user_agent: clientUserAgent,
      order_bumps: orderBumpsData,
    });

    if (insertError) {
      console.error('[Checkout] Insert order error:', JSON.stringify(insertError));
      // If orders table doesn't exist yet, give a clear message
      const msg = insertError.message?.includes('does not exist')
        ? 'Tabela orders não existe. Rode o SQL de migration no Supabase.'
        : `Erro ao criar pedido: ${insertError.message}`;
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    // Create PIX via Expfy
    const baseUrl = request.headers.get('x-forwarded-proto') === 'https'
      ? `https://${request.headers.get('host')}`
      : `${request.nextUrl.origin}`;

    const expfyResponse = await createPixPayment({
      amountInCents: total,
      description: `${product.name}${orderBumpsData.length > 0 ? ' + Kit Impressão' : ''}`,
      customer: {
        name: name.trim(),
        document: cleanedCpf,
        email: normalizedEmail,
      },
      externalId,
      callbackUrl: `${baseUrl}/api/webhook/expfy`,
    });

    // Update order with transaction_id
    await supabase
      .from('orders')
      .update({ transaction_id: expfyResponse.data.transaction_id })
      .eq('external_id', externalId);

    // Fire Meta CAPI InitiateCheckout
    if (metaEventId) {
      sendMetaEventWithName(name.trim(), {
        eventName: 'InitiateCheckout',
        eventId: metaEventId,
        sourceUrl: `${baseUrl}/checkout?product=${productId}`,
        userData: {
          email: normalizedEmail,
          phone: cleanedPhone,
          cpf: cleanedCpf,
          fbc: fbc || null,
          fbp: fbp || null,
          clientIpAddress: clientIp,
          clientUserAgent: clientUserAgent,
        },
        customData: {
          value: total / 100,
          currency: 'BRL',
          contentIds: [productId],
          contents: [{ id: productId, quantity: 1 }],
        },
      }).catch(err => console.error('[Meta CAPI] InitiateCheckout error:', err));
    }

    return NextResponse.json({
      success: true,
      data: {
        qrCode: expfyResponse.data.qr_code,
        qrCodeImage: expfyResponse.data.qr_code_image,
        transactionId: expfyResponse.data.transaction_id,
        externalId,
        amount: total,
        displayAmount: `R$ ${(total / 100).toFixed(2).replace('.', ',')}`,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[Checkout] Unhandled error:', msg);
    return NextResponse.json({ error: `Erro interno: ${msg}` }, { status: 500 });
  }
}

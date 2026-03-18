import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { stripe } from '@/app/lib/stripe';
import { sendMetaEventWithName } from '@/app/lib/meta-conversions';
import { CHECKOUT_PRODUCTS, ORDER_BUMP, calculateTotal } from '@/app/lib/checkout-products';
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

    if (!validateName(name)) return NextResponse.json({ error: 'Nome completo é obrigatório' }, { status: 400 });
    if (!validateEmail(email)) return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    if (!validateCPF(cpf)) return NextResponse.json({ error: 'CPF inválido' }, { status: 400 });
    if (!validatePhone(phone)) return NextResponse.json({ error: 'Telefone inválido' }, { status: 400 });

    const product = CHECKOUT_PRODUCTS[productId];
    if (!product) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 400 });

    const cleanedCpf = cleanCPF(cpf);
    const cleanedPhone = cleanPhone(phone);
    const normalizedEmail = email.toLowerCase().trim();
    const total = calculateTotal(product, orderBumps);
    const externalId = randomUUID();

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || null;
    const clientUserAgent = request.headers.get('user-agent') || null;

    const orderBumpsData = orderBumps.includes('kit-impressao')
      ? [{ id: ORDER_BUMP.id, name: ORDER_BUMP.name, amount: ORDER_BUMP.priceInCents }]
      : [];

    // Cria Customer no Stripe (para salvar cartão para one-click upsell)
    const customer = await stripe.customers.create({
      email: normalizedEmail,
      name: name.trim(),
      metadata: { cpf: cleanedCpf, phone: cleanedPhone, external_id: externalId },
    });

    // Cria PaymentIntent com setup_future_usage para salvar o cartão
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'brl',
      customer: customer.id,
      setup_future_usage: 'off_session',
      metadata: {
        external_id: externalId,
        product_id: productId,
        order_bumps: JSON.stringify(orderBumpsData),
      },
      description: `${product.name}${orderBumpsData.length > 0 ? ' + Kit Impressão' : ''}`,
    });

    // Insere order no Supabase
    const { error: insertError } = await supabase.from('orders').insert({
      email: normalizedEmail,
      name: name.trim(),
      cpf: cleanedCpf,
      phone: cleanedPhone,
      product_id: productId,
      product_name: product.name,
      amount: total,
      payment_method: 'card',
      external_id: externalId,
      status: 'pending',
      stripe_payment_intent_id: paymentIntent.id,
      stripe_customer_id: customer.id,
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
      console.error('[Stripe Checkout] Insert error:', insertError);
      return NextResponse.json({ error: `Erro ao criar pedido: ${insertError.message}` }, { status: 500 });
    }

    // Meta CAPI InitiateCheckout
    const baseUrl = request.headers.get('x-forwarded-proto') === 'https'
      ? `https://${request.headers.get('host')}`
      : `${request.nextUrl.origin}`;

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
        clientSecret: paymentIntent.client_secret,
        externalId,
        amount: total,
        displayAmount: `R$ ${(total / 100).toFixed(2).replace('.', ',')}`,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[Stripe Checkout] Error:', msg);
    return NextResponse.json({ error: `Erro interno: ${msg}` }, { status: 500 });
  }
}

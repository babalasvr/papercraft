import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { createPixPayment } from '@/app/lib/expfy';
import { sendMetaEventWithName } from '@/app/lib/meta-conversions';
import { randomUUID } from 'crypto';

// Upsell products with prices
const UPSELL_PRODUCTS: Record<string, { name: string; priceInCents: number }> = {
  'pack-eva': { name: 'Pack EVA Premium', priceInCents: 1990 },
  'metodo-lucrar': { name: 'Método Lucrar com Papercraft', priceInCents: 4700 },
  'calculadora-precificacao': { name: 'Calculadora de Precificação', priceInCents: 2700 },
  'pack-animais': { name: 'Pack Animais Low Poly', priceInCents: 990 },
  // Downsell prices
  'metodo-lucrar-downsell': { name: 'Método Lucrar com Papercraft', priceInCents: 1990 },
  'calculadora-downsell': { name: 'Calculadora de Precificação', priceInCents: 1490 },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, upsellProductId, metaEventId } = body;

    if (!orderId || !upsellProductId) {
      return NextResponse.json({ error: 'orderId e upsellProductId são obrigatórios' }, { status: 400 });
    }

    const upsellProduct = UPSELL_PRODUCTS[upsellProductId];
    if (!upsellProduct) {
      return NextResponse.json({ error: 'Produto upsell não encontrado' }, { status: 400 });
    }

    // Fetch original order to get customer data
    const { data: originalOrder, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('external_id', orderId)
      .single();

    if (orderError || !originalOrder) {
      return NextResponse.json({ error: 'Pedido original não encontrado' }, { status: 404 });
    }

    const externalId = randomUUID();

    // Create new order for upsell
    const { error: insertError } = await supabase.from('orders').insert({
      email: originalOrder.email,
      name: originalOrder.name,
      cpf: originalOrder.cpf,
      phone: originalOrder.phone,
      product_id: upsellProductId,
      product_name: upsellProduct.name,
      amount: upsellProduct.priceInCents,
      payment_method: 'pix',
      external_id: externalId,
      status: 'pending',
      utm_source: originalOrder.utm_source,
      utm_medium: originalOrder.utm_medium,
      utm_campaign: originalOrder.utm_campaign,
      utm_term: originalOrder.utm_term,
      utm_content: originalOrder.utm_content,
      meta_event_id: metaEventId || null,
      fbc: originalOrder.fbc,
      fbp: originalOrder.fbp,
      client_ip: originalOrder.client_ip,
      client_user_agent: originalOrder.client_user_agent,
      order_bumps: [],
    });

    if (insertError) {
      console.error('[Upsell PIX] Insert error:', insertError);
      return NextResponse.json({ error: 'Erro ao criar pedido upsell' }, { status: 500 });
    }

    // Create PIX via Expfy
    const baseUrl = request.headers.get('x-forwarded-proto') === 'https'
      ? `https://${request.headers.get('host')}`
      : `${request.nextUrl.origin}`;

    const expfyResponse = await createPixPayment({
      amountInCents: upsellProduct.priceInCents,
      description: upsellProduct.name,
      customer: {
        name: originalOrder.name,
        document: originalOrder.cpf,
        email: originalOrder.email,
      },
      externalId,
      callbackUrl: `${baseUrl}/api/webhook/expfy`,
    });

    // Update order with transaction_id
    await supabase
      .from('orders')
      .update({ transaction_id: expfyResponse.data.transaction_id })
      .eq('external_id', externalId);

    // Fire Meta CAPI InitiateCheckout for upsell
    if (metaEventId) {
      sendMetaEventWithName(originalOrder.name, {
        eventName: 'InitiateCheckout',
        eventId: metaEventId,
        sourceUrl: `${baseUrl}/upsell`,
        userData: {
          email: originalOrder.email,
          phone: originalOrder.phone,
          cpf: originalOrder.cpf,
          fbc: originalOrder.fbc || null,
          fbp: originalOrder.fbp || null,
          clientIpAddress: originalOrder.client_ip || null,
          clientUserAgent: originalOrder.client_user_agent || null,
        },
        customData: {
          value: upsellProduct.priceInCents / 100,
          currency: 'BRL',
          contentIds: [upsellProductId],
          contents: [{ id: upsellProductId, quantity: 1 }],
        },
      }).catch(err => console.error('[Meta CAPI] Upsell InitiateCheckout error:', err));
    }

    return NextResponse.json({
      success: true,
      data: {
        qrCode: expfyResponse.data.qr_code,
        qrCodeImage: expfyResponse.data.qr_code_image,
        transactionId: expfyResponse.data.transaction_id,
        externalId,
        amount: upsellProduct.priceInCents,
        displayAmount: `R$ ${(upsellProduct.priceInCents / 100).toFixed(2).replace('.', ',')}`,
      },
    });
  } catch (error) {
    console.error('[Upsell PIX] Error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

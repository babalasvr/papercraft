import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { stripe } from '@/app/lib/stripe';
import { sendMetaEventWithName } from '@/app/lib/meta-conversions';
import { sendUtmifyOrder } from '@/app/lib/utmify';
import { CHECKOUT_PRODUCTS } from '@/app/lib/checkout-products';
import { randomUUID } from 'crypto';

const UPSELL_PRODUCTS: Record<string, { name: string; priceInCents: number }> = {
  'pack-eva': { name: 'Pack EVA Premium', priceInCents: 1990 },
  'metodo-lucrar': { name: 'Método Lucrar com Papercraft', priceInCents: 4700 },
  'calculadora-precificacao': { name: 'Calculadora de Precificação', priceInCents: 2700 },
  'pack-animais': { name: 'Pack Animais Selvagens', priceInCents: 990 },
  'metodo-lucrar-downsell': { name: 'Método Lucrar (Oferta Especial)', priceInCents: 1990 },
  'calculadora-downsell': { name: 'Calculadora (Oferta Especial)', priceInCents: 1490 },
};

export async function POST(request: NextRequest) {
  try {
    const { orderId, upsellProductId, metaEventId } = await request.json();

    if (!orderId || !upsellProductId) {
      return NextResponse.json({ error: 'orderId e upsellProductId são obrigatórios' }, { status: 400 });
    }

    const upsellProduct = UPSELL_PRODUCTS[upsellProductId];
    if (!upsellProduct) {
      return NextResponse.json({ error: 'Produto de upsell não encontrado' }, { status: 400 });
    }

    // Busca o pedido original para pegar os dados do cliente e do cartão
    const { data: originalOrder, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('external_id', orderId)
      .single();

    if (orderError || !originalOrder) {
      return NextResponse.json({ error: 'Pedido original não encontrado' }, { status: 404 });
    }

    if (!originalOrder.stripe_customer_id) {
      return NextResponse.json({ error: 'Pedido original não tem cartão salvo' }, { status: 400 });
    }

    // Busca o payment method do cliente no Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: originalOrder.stripe_customer_id,
      type: 'card',
    });

    if (!paymentMethods.data.length) {
      return NextResponse.json({ error: 'Nenhum cartão salvo encontrado' }, { status: 400 });
    }

    const paymentMethod = paymentMethods.data[0];
    const last4 = paymentMethod.card?.last4 || null;

    // Cria novo externalId para o upsell
    const upsellExternalId = randomUUID();

    // Insere order de upsell no Supabase
    const { error: insertError } = await supabase.from('orders').insert({
      email: originalOrder.email,
      name: originalOrder.name,
      cpf: originalOrder.cpf,
      phone: originalOrder.phone,
      product_id: upsellProductId,
      product_name: upsellProduct.name,
      amount: upsellProduct.priceInCents,
      payment_method: 'card',
      external_id: upsellExternalId,
      status: 'pending',
      stripe_customer_id: originalOrder.stripe_customer_id,
      utm_source: originalOrder.utm_source,
      utm_medium: originalOrder.utm_medium,
      utm_campaign: originalOrder.utm_campaign,
      utm_term: originalOrder.utm_term,
      utm_content: originalOrder.utm_content,
      fbc: originalOrder.fbc,
      fbp: originalOrder.fbp,
      client_ip: originalOrder.client_ip,
      client_user_agent: originalOrder.client_user_agent,
      order_bumps: [],
    });

    if (insertError) {
      console.error('[Upsell Stripe] Insert error:', insertError);
      return NextResponse.json({ error: 'Erro ao criar pedido de upsell' }, { status: 500 });
    }

    // Cria e confirma PaymentIntent off_session (sem interação do usuário)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: upsellProduct.priceInCents,
      currency: 'brl',
      customer: originalOrder.stripe_customer_id,
      payment_method: paymentMethod.id,
      confirm: true,
      off_session: true,
      metadata: {
        external_id: upsellExternalId,
        product_id: upsellProductId,
        order_bumps: '[]',
      },
      description: upsellProduct.name,
    });

    if (paymentIntent.status !== 'succeeded') {
      await supabase
        .from('orders')
        .update({ status: 'failed' })
        .eq('external_id', upsellExternalId);
      return NextResponse.json({ error: 'Pagamento não aprovado pelo banco' }, { status: 402 });
    }

    const paidAt = new Date().toISOString();

    // Marca como pago
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        paid_at: paidAt,
        stripe_payment_intent_id: paymentIntent.id,
        stripe_payment_method_id: paymentMethod.id,
        last4,
      })
      .eq('external_id', upsellExternalId);

    // Adiciona produto ao membro
    const normalizedEmail = (originalOrder.email as string).toLowerCase().trim();

    const { error: rpcError } = await supabase.rpc('append_purchased_product', {
      p_email: normalizedEmail,
      p_product: upsellProductId,
    });
    if (rpcError) {
      const { data: member } = await supabase
        .from('members')
        .select('purchased_products')
        .eq('email', normalizedEmail)
        .single();
      const current: string[] = member?.purchased_products ?? [];
      if (!current.includes(upsellProductId)) {
        await supabase
          .from('members')
          .update({ purchased_products: [...current, upsellProductId] })
          .eq('email', normalizedEmail);
      }
    }

    // Meta CAPI Purchase
    const purchaseEventId = metaEventId || randomUUID();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://papercraft-br.shop';

    sendMetaEventWithName(originalOrder.name as string, {
      eventName: 'Purchase',
      eventId: purchaseEventId,
      sourceUrl: `${baseUrl}/upsell-eva`,
      userData: {
        email: normalizedEmail,
        phone: originalOrder.phone as string,
        cpf: originalOrder.cpf as string,
        fbc: (originalOrder.fbc as string) || null,
        fbp: (originalOrder.fbp as string) || null,
        clientIpAddress: (originalOrder.client_ip as string) || null,
        clientUserAgent: (originalOrder.client_user_agent as string) || null,
      },
      customData: {
        value: upsellProduct.priceInCents / 100,
        currency: 'BRL',
        contentIds: [upsellProductId],
        contents: [{ id: upsellProductId, quantity: 1 }],
        orderId: upsellExternalId,
      },
    }).catch(err => console.error('[Meta CAPI] Upsell Purchase error:', err));

    // UTMify
    sendUtmifyOrder({
      orderId: upsellExternalId,
      status: 'paid',
      email: normalizedEmail,
      name: originalOrder.name as string,
      phone: originalOrder.phone as string,
      cpf: originalOrder.cpf as string,
      productId: upsellProductId,
      productName: upsellProduct.name,
      amountInCents: upsellProduct.priceInCents,
      paidAt,
      utmSource: originalOrder.utm_source as string | null,
      utmMedium: originalOrder.utm_medium as string | null,
      utmCampaign: originalOrder.utm_campaign as string | null,
      utmTerm: originalOrder.utm_term as string | null,
      utmContent: originalOrder.utm_content as string | null,
    }).catch(err => console.error('[UTMify] Upsell erro:', err));

    console.log(`[Upsell Stripe] Upsell pago: ${normalizedEmail} → ${upsellProductId}`);

    return NextResponse.json({ success: true, last4 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[Upsell Stripe] Error:', msg);
    // Erro de autenticação 3DS (cartão exige verificação)
    if (msg.includes('authentication_required') || msg.includes('requires_action')) {
      return NextResponse.json({ error: 'Cartão requer autenticação adicional. Use PIX para esta compra.' }, { status: 402 });
    }
    return NextResponse.json({ error: `Erro interno: ${msg}` }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';
import { supabase } from '@/app/lib/supabase';
import { sendMetaEventWithName } from '@/app/lib/meta-conversions';
import { sendPurchaseEmail } from '@/app/lib/email';
import { sendPurchaseWhatsApp } from '@/app/lib/whatsapp';
import { sendUtmifyOrder } from '@/app/lib/utmify';
import { CHECKOUT_PRODUCTS } from '@/app/lib/checkout-products';
import { randomUUID } from 'crypto';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[Stripe Webhook] Assinatura inválida:', err);
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 });
  }

  if (event.type !== 'payment_intent.succeeded') {
    return NextResponse.json({ success: true, action: 'ignored' });
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const externalId = paymentIntent.metadata?.external_id;

  if (!externalId) {
    console.error('[Stripe Webhook] external_id ausente no metadata');
    return NextResponse.json({ error: 'external_id ausente' }, { status: 400 });
  }

  // Busca o pedido
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('external_id', externalId)
    .single();

  if (orderError || !order) {
    console.error('[Stripe Webhook] Pedido não encontrado:', externalId);
    return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
  }

  // Idempotência: pula se já processado
  if (order.status === 'paid') {
    console.log(`[Stripe Webhook] Pedido já pago, ignorando: ${externalId}`);
    return NextResponse.json({ success: true, action: 'already_paid' });
  }

  // Pega last4 do cartão
  let last4: string | null = null;
  let paymentMethodId: string | null = null;
  if (paymentIntent.payment_method) {
    paymentMethodId = typeof paymentIntent.payment_method === 'string'
      ? paymentIntent.payment_method
      : paymentIntent.payment_method.id;
    try {
      const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
      last4 = pm.card?.last4 || null;
    } catch { /* ignora */ }
  }

  const paidAt = new Date().toISOString();

  return processStripeOrder(order, paidAt, paymentMethodId, last4);
}

async function processStripeOrder(
  order: Record<string, unknown>,
  paidAt: string,
  paymentMethodId: string | null,
  last4: string | null,
) {
  const email = order.email as string;
  const name = order.name as string;
  const productId = order.product_id as string;
  const orderBumps = (order.order_bumps as { id: string }[]) || [];
  const normalizedEmail = email.toLowerCase().trim();

  // Atualiza status do pedido
  await supabase
    .from('orders')
    .update({
      status: 'paid',
      paid_at: paidAt,
      stripe_payment_method_id: paymentMethodId,
      last4,
    })
    .eq('external_id', order.external_id as string);

  const product = CHECKOUT_PRODUCTS[productId];
  const plan = product?.plan || 'iniciante';

  // Cria/atualiza membro
  const { data: rows } = await supabase
    .from('members')
    .select('id, plan')
    .eq('email', normalizedEmail)
    .limit(1);

  const existing = rows?.[0] ?? null;

  if (existing) {
    const updates: Record<string, unknown> = { active: true };
    if (existing.plan === 'iniciante' && plan === 'mestre') {
      updates.plan = 'mestre';
      updates.product_id = productId;
    }
    await supabase.from('members').update(updates).eq('id', existing.id);
  } else {
    await supabase.from('members').insert({
      email: normalizedEmail,
      name,
      plan,
      product_id: productId,
      active: true,
    });
  }

  // Adiciona produtos comprados
  const productsToAppend = [productId, ...orderBumps.map((b) => b.id)];
  for (const productToAdd of productsToAppend) {
    const { error: rpcError } = await supabase.rpc('append_purchased_product', {
      p_email: normalizedEmail,
      p_product: productToAdd,
    });
    if (rpcError) {
      const { data: member } = await supabase
        .from('members')
        .select('purchased_products')
        .eq('email', normalizedEmail)
        .single();
      const current: string[] = member?.purchased_products ?? [];
      if (!current.includes(productToAdd)) {
        await supabase
          .from('members')
          .update({ purchased_products: [...current, productToAdd] })
          .eq('email', normalizedEmail);
      }
    }
  }

  // Email + WhatsApp (apenas produtos principais)
  const isMainProduct = !!CHECKOUT_PRODUCTS[productId];
  const productName = product?.name || productId;
  const phone = order.phone as string;

  if (isMainProduct) {
    sendPurchaseEmail({ to: normalizedEmail, name, productName, plan })
      .catch(err => console.error('[Email] Erro:', err));
    if (phone) {
      sendPurchaseWhatsApp({ phone, name, productName, plan, email: normalizedEmail })
        .catch(err => console.error('[WhatsApp] Erro:', err));
    }
  }

  // Meta CAPI Purchase — apenas produtos principais (não upsells)
  if (isMainProduct) {
    const purchaseEventId = randomUUID();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://papercraft-br.shop';
    sendMetaEventWithName(name, {
      eventName: 'Purchase',
      eventId: purchaseEventId,
      sourceUrl: `${baseUrl}/checkout?product=${productId}`,
      userData: {
        email: normalizedEmail,
        phone: order.phone as string,
        cpf: order.cpf as string,
        fbc: (order.fbc as string) || null,
        fbp: (order.fbp as string) || null,
        clientIpAddress: (order.client_ip as string) || null,
        clientUserAgent: (order.client_user_agent as string) || null,
      },
      customData: {
        value: (order.amount as number) / 100,
        currency: 'BRL',
        contentIds: [productId],
        contents: [{ id: productId, quantity: 1 }],
        orderId: order.external_id as string,
      },
    }).catch(err => console.error('[Meta CAPI] Purchase error:', err));
  }

  // UTMify
  sendUtmifyOrder({
    orderId: order.external_id as string,
    status: 'paid',
    email: normalizedEmail,
    name,
    phone: order.phone as string,
    cpf: order.cpf as string,
    productId,
    productName,
    amountInCents: order.amount as number,
    paidAt,
    utmSource: order.utm_source as string | null,
    utmMedium: order.utm_medium as string | null,
    utmCampaign: order.utm_campaign as string | null,
    utmTerm: order.utm_term as string | null,
    utmContent: order.utm_content as string | null,
  }).catch(err => console.error('[UTMify] Erro:', err));

  console.log(`[Stripe Webhook] Pedido pago: ${normalizedEmail} → ${productId} (${plan})`);

  return NextResponse.json({ success: true, action: existing ? 'updated' : 'created' });
}

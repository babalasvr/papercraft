import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { verifyExpfySignature } from '@/app/lib/expfy';
import { sendMetaEventWithName } from '@/app/lib/meta-conversions';
import { sendPurchaseEmail } from '@/app/lib/email';
import { sendPurchaseWhatsApp } from '@/app/lib/whatsapp';
import { sendUtmifyOrder } from '@/app/lib/utmify';
import { CHECKOUT_PRODUCTS } from '@/app/lib/checkout-products';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature') || '';

    // Verify HMAC signature (skip if no webhook secret configured yet)
    if (process.env.EXPFY_WEBHOOK_SECRET && signature) {
      if (!verifyExpfySignature(rawBody, signature)) {
        console.error('[Expfy Webhook] Invalid signature');
        return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
      }
    }

    const body = JSON.parse(rawBody);
    const event = body.event;

    if (event !== 'payment.confirmed') {
      return NextResponse.json({ success: true, action: 'ignored' });
    }

    const transactionId = body.transaction_id || body.data?.transaction_id;
    const externalId = body.external_id || body.data?.external_id;
    const paidAt = body.paid_at || body.data?.paid_at || new Date().toISOString();

    // Find order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('external_id', externalId)
      .single();

    if (orderError || !order) {
      // Try by transaction_id
      const { data: orderByTx } = await supabase
        .from('orders')
        .select('*')
        .eq('transaction_id', transactionId)
        .single();

      if (!orderByTx) {
        console.error('[Expfy Webhook] Order not found:', externalId, transactionId);
        return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
      }

      return processOrder(orderByTx, paidAt);
    }

    return processOrder(order, paidAt);
  } catch (error) {
    console.error('[Expfy Webhook] Error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

async function processOrder(order: Record<string, unknown>, paidAt: string) {
  // Idempotency guard: skip if already processed
  if (order.status === 'paid') {
    console.log(`[Expfy Webhook] Order already paid, skipping: ${order.external_id}`);
    return NextResponse.json({ success: true, action: 'already_paid' });
  }

  const email = order.email as string;
  const name = order.name as string;
  const productId = order.product_id as string;
  const orderBumps = (order.order_bumps as { id: string }[]) || [];

  // Update order status
  await supabase
    .from('orders')
    .update({ status: 'paid', paid_at: paidAt })
    .eq('external_id', order.external_id as string);

  // Determine plan from product
  const product = CHECKOUT_PRODUCTS[productId];
  const plan = product?.plan || 'iniciante';

  // Create/update member (same logic as Cakto webhook)
  const normalizedEmail = email.toLowerCase().trim();

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

  // Append main product + order bumps to purchased_products
  const productsToAppend = [productId, ...orderBumps.map((b) => b.id)];

  for (const productToAdd of productsToAppend) {
    const { error: rpcError } = await supabase.rpc('append_purchased_product', {
      p_email: normalizedEmail,
      p_product: productToAdd,
    });

    if (rpcError) {
      // Fallback
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

  // Só envia email/WhatsApp em compras principais (produtos do checkout), não em upsells
  const isMainProduct = !!CHECKOUT_PRODUCTS[productId];
  const productName = product?.name || productId;
  const phone = order.phone as string;

  if (isMainProduct) {
    // Email de boas-vindas
    sendPurchaseEmail({
      to: normalizedEmail,
      name,
      productName,
      plan,
    }).catch(err => console.error('[Email] Erro ao enviar:', err));

    // WhatsApp
    if (phone) {
      sendPurchaseWhatsApp({
        phone,
        name,
        productName,
        plan,
        email: normalizedEmail,
      }).catch(err => console.error('[WhatsApp] Erro ao enviar:', err));
    }
  }

  // Fire Meta CAPI Purchase event
  const purchaseEventId = randomUUID();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://papercraftbrasil.com';

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

  // UTMify — rastreamento de conversão e ROI
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
  }).catch(err => console.error('[UTMify] Erro ao enviar evento:', err));

  console.log(`[Expfy Webhook] Order paid: ${normalizedEmail} → ${productId} (${plan})`);

  return NextResponse.json({
    success: true,
    action: existing ? 'updated' : 'created',
  });
}

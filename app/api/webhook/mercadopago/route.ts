import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { getPayment } from '@/app/lib/mercadopago';
import { sendMetaEventWithName } from '@/app/lib/meta-conversions';
import { CHECKOUT_PRODUCTS } from '@/app/lib/checkout-products';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // MP sends { action: "payment.updated", data: { id: "..." } }
    const action = body.action as string;
    const paymentId = body.data?.id?.toString();

    if (!action?.startsWith('payment') || !paymentId) {
      return NextResponse.json({ success: true, action: 'ignored' });
    }

    // Fetch payment details from MP
    const payment = await getPayment(paymentId);

    const mpStatus = payment.status;
    const externalReference = payment.external_reference;

    if (!externalReference) {
      return NextResponse.json({ error: 'external_reference ausente' }, { status: 400 });
    }

    // Find order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('external_id', externalReference)
      .single();

    if (orderError || !order) {
      console.error('[MP Webhook] Order not found:', externalReference);
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    // Already processed
    if (order.status === 'paid') {
      return NextResponse.json({ success: true, action: 'already_paid' });
    }

    const now = new Date().toISOString();

    if (mpStatus === 'approved') {
      await supabase
        .from('orders')
        .update({ status: 'paid', paid_at: now, transaction_id: paymentId })
        .eq('external_id', externalReference);

      const email = order.email as string;
      const name = order.name as string;
      const productId = order.product_id as string;
      const orderBumps = (order.order_bumps as { id: string }[]) || [];
      const normalizedEmail = email.toLowerCase().trim();

      const product = CHECKOUT_PRODUCTS[productId];
      const plan = product?.plan || 'iniciante';

      // Create/update member
      const { data: rows } = await supabase.from('members').select('id, plan').eq('email', normalizedEmail).limit(1);
      const existing = rows?.[0] ?? null;

      if (existing) {
        const updates: Record<string, unknown> = { active: true };
        if (existing.plan === 'iniciante' && plan === 'mestre') {
          updates.plan = 'mestre';
          updates.product_id = productId;
        }
        await supabase.from('members').update(updates).eq('id', existing.id);
      } else {
        await supabase.from('members').insert({ email: normalizedEmail, name, plan, product_id: productId, active: true });
      }

      // Add products to purchased_products
      const productsToAdd = [productId, ...orderBumps.map((b) => b.id)];
      for (const p of productsToAdd) {
        const { error: rpcError } = await supabase.rpc('append_purchased_product', { p_email: normalizedEmail, p_product: p });
        if (rpcError) {
          const { data: member } = await supabase.from('members').select('purchased_products').eq('email', normalizedEmail).single();
          const current: string[] = member?.purchased_products ?? [];
          if (!current.includes(p)) {
            await supabase.from('members').update({ purchased_products: [...current, p] }).eq('email', normalizedEmail);
          }
        }
      }

      // Meta CAPI Purchase
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
          orderId: externalReference,
        },
      }).catch(err => console.error('[Meta CAPI] MP Purchase error:', err));

      console.log(`[MP Webhook] Order paid: ${normalizedEmail} → ${productId}`);
      return NextResponse.json({ success: true, action: 'paid' });
    }

    if (mpStatus === 'rejected' || mpStatus === 'cancelled') {
      await supabase
        .from('orders')
        .update({ status: 'rejected', transaction_id: paymentId })
        .eq('external_id', externalReference);
      return NextResponse.json({ success: true, action: 'rejected' });
    }

    return NextResponse.json({ success: true, action: 'pending' });
  } catch (error) {
    console.error('[MP Webhook] Error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

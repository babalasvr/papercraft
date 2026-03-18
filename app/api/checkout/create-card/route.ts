import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { createCardPayment } from '@/app/lib/mercadopago';
import { sendMetaEventWithName } from '@/app/lib/meta-conversions';
import { CHECKOUT_PRODUCTS } from '@/app/lib/checkout-products';
import { ORDER_BUMP } from '@/app/lib/checkout-products';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      token, paymentMethodId, installments,
      name, email, cpf, phone,
      productId, orderBumps,
      utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
      metaEventId, fbc, fbp,
    } = body;

    if (!token || !paymentMethodId || !name || !email || !cpf || !productId) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    const product = CHECKOUT_PRODUCTS[productId];
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 400 });
    }

    const bumps: string[] = Array.isArray(orderBumps) ? orderBumps : [];
    let amountInCents = product.priceInCents;
    if (bumps.includes('kit-impressao')) amountInCents += ORDER_BUMP.priceInCents;

    const externalId = randomUUID();
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '';
    const clientUserAgent = request.headers.get('user-agent') || '';
    const normalizedEmail = email.toLowerCase().trim();

    // Create order in Supabase
    const { error: insertError } = await supabase.from('orders').insert({
      email: normalizedEmail,
      name,
      cpf,
      phone,
      product_id: productId,
      product_name: product.name,
      amount: amountInCents,
      payment_method: 'credit_card',
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
      order_bumps: bumps.map((id) => ({
        id,
        name: id === 'kit-impressao' ? ORDER_BUMP.name : id,
        price: id === 'kit-impressao' ? ORDER_BUMP.priceInCents : 0,
      })),
    });

    if (insertError) {
      console.error('[Create Card] Insert error:', insertError);
      return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 });
    }

    // Create payment in Mercado Pago
    const mpResponse = await createCardPayment({
      token,
      paymentMethodId,
      installments: installments || 1,
      amountInCents,
      description: product.name,
      customer: { name, email: normalizedEmail, cpf },
      externalReference: externalId,
    });

    const mpStatus = mpResponse.status;
    const mpId = mpResponse.id?.toString() || '';

    // Update order with MP payment id and status
    let orderStatus = 'pending';
    if (mpStatus === 'approved') orderStatus = 'paid';
    else if (mpStatus === 'rejected') orderStatus = 'rejected';

    await supabase
      .from('orders')
      .update({ transaction_id: mpId, status: orderStatus, paid_at: orderStatus === 'paid' ? new Date().toISOString() : null })
      .eq('external_id', externalId);

    // If approved immediately, create member
    if (orderStatus === 'paid') {
      await provisionMember({ normalizedEmail, name, productId, bumps, product });

      const purchaseEventId = randomUUID();
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://papercraft-br.shop';
      sendMetaEventWithName(name, {
        eventName: 'Purchase',
        eventId: purchaseEventId,
        sourceUrl: `${baseUrl}/checkout?product=${productId}`,
        userData: { email: normalizedEmail, phone, cpf, fbc: fbc || null, fbp: fbp || null, clientIpAddress: clientIp, clientUserAgent },
        customData: {
          value: amountInCents / 100,
          currency: 'BRL',
          contentIds: [productId],
          contents: [{ id: productId, quantity: 1 }],
          orderId: externalId,
        },
      }).catch(err => console.error('[Meta CAPI] Card Purchase error:', err));
    }

    return NextResponse.json({
      success: true,
      data: {
        status: mpStatus,
        statusDetail: mpResponse.status_detail,
        externalId,
        mpPaymentId: mpId,
      },
    });
  } catch (error) {
    console.error('[Create Card] Error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

async function provisionMember(opts: {
  normalizedEmail: string;
  name: string;
  productId: string;
  bumps: string[];
  product: { plan: 'iniciante' | 'mestre' };
}) {
  const db = supabase;
  const { normalizedEmail, name, productId, bumps, product } = opts;

  const { data: rows } = await db
    .from('members')
    .select('id, plan')
    .eq('email', normalizedEmail)
    .limit(1);

  const existing = rows?.[0] ?? null;

  if (existing) {
    const updates: Record<string, unknown> = { active: true };
    if (existing.plan === 'iniciante' && product.plan === 'mestre') {
      updates.plan = 'mestre';
      updates.product_id = productId;
    }
    await db.from('members').update(updates).eq('id', existing.id);
  } else {
    await db.from('members').insert({
      email: normalizedEmail,
      name,
      plan: product.plan,
      product_id: productId,
      active: true,
    });
  }

  const productsToAdd = [productId, ...bumps];
  for (const p of productsToAdd) {
    const { error: rpcError } = await db.rpc('append_purchased_product', {
      p_email: normalizedEmail,
      p_product: p,
    });
    if (rpcError) {
      const { data: member } = await db.from('members').select('purchased_products').eq('email', normalizedEmail).single();
      const current: string[] = member?.purchased_products ?? [];
      if (!current.includes(p)) {
        await db.from('members').update({ purchased_products: [...current, p] }).eq('email', normalizedEmail);
      }
    }
  }
}

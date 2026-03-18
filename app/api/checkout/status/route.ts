import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(request: NextRequest) {
  const externalId = request.nextUrl.searchParams.get('external_id');

  if (!externalId) {
    return NextResponse.json({ error: 'external_id é obrigatório' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('orders')
    .select('status, stripe_customer_id, last4')
    .eq('external_id', externalId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
  }

  return NextResponse.json({
    status: data.status,
    stripeCustomerId: data.stripe_customer_id || null,
    last4: data.last4 || null,
  });
}

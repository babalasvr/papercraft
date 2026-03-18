import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { createPixPayment } from '@/app/lib/expfy';
import { randomUUID } from 'crypto';

// Products available for purchase in the members area
const MEMBER_PRODUCTS: Record<string, { name: string; priceInCents: number }> = {
  'pack-eva': { name: 'Pack EVA Premium', priceInCents: 1990 },
  'metodo-lucrar': { name: 'Método Lucrar com Papercraft', priceInCents: 4700 },
  'calculadora-precificacao': { name: 'Calculadora de Precificação', priceInCents: 2700 },
  'pack-animais': { name: 'Pack Animais Low Poly', priceInCents: 990 },
  'kit-impressao': { name: 'Kit Impressão Profissional', priceInCents: 790 },
  'kit-mestre-upgrade': { name: 'Upgrade Kit Mestre Papercraft', priceInCents: 1700 },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, productId } = body;

    if (!email || !productId) {
      return NextResponse.json({ error: 'email e productId são obrigatórios' }, { status: 400 });
    }

    const product = MEMBER_PRODUCTS[productId];
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 400 });
    }

    // Look up member to get their name
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('name, email')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (memberError || !member) {
      console.error('[Member PIX] Member not found:', memberError);
      return NextResponse.json({ error: 'Membro não encontrado' }, { status: 404 });
    }

    // Try to get CPF + phone from the most recent order for this email
    const { data: lastOrder } = await supabase
      .from('orders')
      .select('cpf, phone')
      .eq('email', email.toLowerCase().trim())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const cpf = lastOrder?.cpf || '';
    const phone = lastOrder?.phone || '';

    const externalId = randomUUID();

    // Build base URL for webhook callback
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('host') || '';
    const baseUrl = `${proto}://${host}`;

    // Create PIX via Expfy FIRST (before saving to DB, to avoid orphan records on failure)
    const expfyResponse = await createPixPayment({
      amountInCents: product.priceInCents,
      description: product.name,
      customer: {
        name: member.name,
        document: cpf || '00000000000',
        email: member.email,
      },
      externalId,
      callbackUrl: `${baseUrl}/api/webhook/expfy`,
    });

    // Create order record after PIX is confirmed
    const { error: insertError } = await supabase.from('orders').insert({
      email: member.email,
      name: member.name,
      cpf: cpf || '',
      phone: phone || '',
      product_id: productId,
      product_name: product.name,
      amount: product.priceInCents,
      payment_method: 'pix',
      external_id: externalId,
      transaction_id: expfyResponse.data.transaction_id,
      status: 'pending',
      order_bumps: [],
    });

    if (insertError) {
      console.error('[Member PIX] Insert error:', JSON.stringify(insertError));
      // Still return PIX data — webhook will handle attribution even without an order record
    }

    console.log(`[Member PIX] PIX gerado: ${member.email} → ${productId}`);

    return NextResponse.json({
      success: true,
      data: {
        qrCode: expfyResponse.data.qr_code,
        qrCodeImage: expfyResponse.data.qr_code_image,
        transactionId: expfyResponse.data.transaction_id,
        externalId,
        amount: product.priceInCents,
        displayAmount: `R$ ${(product.priceInCents / 100).toFixed(2).replace('.', ',')}`,
      },
    });
  } catch (error) {
    console.error('[Member PIX] Error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

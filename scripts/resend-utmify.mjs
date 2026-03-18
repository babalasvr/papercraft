#!/usr/bin/env node
// Script para reenviar vendas para o UTMify
// Uso: node scripts/resend-utmify.mjs
// Opcional: node scripts/resend-utmify.mjs 2025-03-18  (filtra por data)

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Carrega .env.local manualmente
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local');
    const content = readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
    console.log('✅ .env.local carregado\n');
  } catch {
    console.error('❌ Não foi possível carregar .env.local');
    process.exit(1);
  }
}

loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const UTMIFY_TOKEN = process.env.UTMIFY_API_TOKEN;
const UTMIFY_URL = 'https://api.utmify.com.br/api-credentials/orders';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados');
  process.exit(1);
}

if (!UTMIFY_TOKEN) {
  console.error('❌ UTMIFY_API_TOKEN não encontrado no .env.local');
  process.exit(1);
}

// Data filtro (argumento ou hoje)
const filterDate = process.argv[2] || new Date().toISOString().slice(0, 10);
console.log(`📅 Buscando pedidos pagos de: ${filterDate}\n`);

async function fetchOrders() {
  const url = `${SUPABASE_URL}/rest/v1/orders?status=eq.paid&paid_at=gte.${filterDate}T00:00:00&paid_at=lte.${filterDate}T23:59:59&select=*&order=paid_at.asc`;

  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!res.ok) {
    // Tenta sem filtro de paid_at (talvez a coluna se chame outra coisa)
    const url2 = `${SUPABASE_URL}/rest/v1/orders?status=eq.paid&created_at=gte.${filterDate}T00:00:00&created_at=lte.${filterDate}T23:59:59&select=*&order=created_at.asc`;
    const res2 = await fetch(url2, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (!res2.ok) throw new Error(`Supabase error: ${await res2.text()}`);
    return res2.json();
  }

  return res.json();
}

async function sendToUtmify(order) {
  const amountInCents = order.amount || 0;
  const gatewayFeeInCents = Math.round(amountInCents * 0.02);
  const userCommissionInCents = amountInCents - gatewayFeeInCents;

  const productId = order.product_id || 'desconhecido';
  const productName = order.product_name || productId;
  const paidAt = order.paid_at || order.created_at || new Date().toISOString();

  const payload = {
    orderId: order.external_id,
    platform: 'Papercraft Brasil',
    paymentMethod: 'pix',
    status: 'paid',
    isTest: false,
    createdAt: paidAt,
    approvedDate: paidAt,
    refundedAt: null,
    customer: {
      name: order.name || '',
      email: order.email || '',
      phone: order.phone || null,
      document: order.cpf || null,
      country: 'BR',
    },
    products: [
      {
        id: productId,
        name: productName,
        planId: productId,
        planName: productName,
        quantity: 1,
        priceInCents: amountInCents,
      },
    ],
    commission: {
      totalPriceInCents: amountInCents,
      gatewayFeeInCents,
      userCommissionInCents,
    },
    utm: {
      src: order.utm_source || null,
      medium: order.utm_medium || null,
      campaign: order.utm_campaign || null,
      term: order.utm_term || null,
      content: order.utm_content || null,
    },
  };

  const res = await fetch(UTMIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-token': UTMIFY_TOKEN,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`  ❌ Erro ${res.status}:`, text);
    return false;
  }

  return true;
}

async function main() {
  const orders = await fetchOrders();

  if (!orders.length) {
    console.log('⚠️  Nenhum pedido pago encontrado nessa data.');
    console.log('   Tente: node scripts/resend-utmify.mjs YYYY-MM-DD');
    return;
  }

  console.log(`📦 ${orders.length} pedido(s) encontrado(s):\n`);

  let ok = 0;
  let fail = 0;

  for (const order of orders) {
    const valor = order.amount ? `R$ ${(order.amount / 100).toFixed(2)}` : '?';
    console.log(`→ ${order.email} | ${order.product_id} | ${valor}`);
    const success = await sendToUtmify(order);
    if (success) {
      console.log(`  ✅ Enviado para UTMify`);
      ok++;
    } else {
      fail++;
    }
  }

  console.log(`\n✅ ${ok} enviado(s) | ❌ ${fail} com erro`);
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});

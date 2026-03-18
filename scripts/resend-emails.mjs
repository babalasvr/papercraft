#!/usr/bin/env node
// Script para reenviar emails de confirmação de compra via Resend
// Uso: node scripts/resend-emails.mjs
// Opcional: node scripts/resend-emails.mjs 2026-03-18  (filtra por data)

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
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MEMBER_PASSWORD = process.env.MEMBER_PASSWORD || 'paper123';
const MEMBER_URL = 'https://papercraft-br.shop/membros';
const FROM = 'Papercraft Brasil <noreply@papercraft-br.shop>';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados');
  process.exit(1);
}

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY não encontrado no .env.local');
  process.exit(1);
}

// Mapeamento product_id → plan label
function getPlanLabel(productId) {
  if (!productId) return 'Kit Iniciante';
  if (productId.includes('mestre')) return 'Kit Mestre';
  if (productId.includes('eva')) return 'Pack EVA Premium';
  return 'Kit Iniciante';
}

function getPlan(productId) {
  if (!productId) return 'basico';
  if (productId.includes('mestre')) return 'mestre';
  return 'basico';
}

// Data filtro (argumento ou hoje)
const filterDate = process.argv[2] || new Date().toISOString().slice(0, 10);
console.log(`📅 Buscando pedidos pagos de: ${filterDate}\n`);

async function fetchOrders() {
  const url = `${SUPABASE_URL}/rest/v1/orders?status=eq.paid&paid_at=gte.${filterDate}T00:00:00&paid_at=lte.${filterDate}T23:59:59&select=*&order=paid_at.asc`;
  const res = await fetch(url, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });

  if (!res.ok) {
    // fallback: filtra por created_at
    const url2 = `${SUPABASE_URL}/rest/v1/orders?status=eq.paid&created_at=gte.${filterDate}T00:00:00&created_at=lte.${filterDate}T23:59:59&select=*&order=created_at.asc`;
    const res2 = await fetch(url2, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    if (!res2.ok) throw new Error(`Supabase error: ${await res2.text()}`);
    return res2.json();
  }

  return res.json();
}

function buildEmailHtml({ firstName, productName, planLabel, email, password, memberUrl }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Compra confirmada - Papercraft Brasil</title>
</head>
<body style="margin:0;padding:0;background-color:#FFF8F0;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF8F0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <tr>
            <td style="background:linear-gradient(135deg,#C1440E 0%,#E85D04 100%);padding:40px 32px;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:36px;">🎨</p>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;">Papercraft Brasil</h1>
              <p style="margin:8px 0 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Sua compra foi confirmada!</p>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 32px;">
              <h2 style="margin:0 0 8px 0;color:#1a1a1a;font-size:22px;">Olá, ${firstName}! 🎉</h2>
              <p style="margin:0 0 24px 0;color:#555;font-size:15px;line-height:1.6;">
                Sua compra do <strong>${productName}</strong> foi confirmada com sucesso!
                Seus moldes já estão disponíveis para acesso.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF3E0;border:2px solid #E85D04;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 16px 0;color:#C1440E;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">🔑 Seus dados de acesso</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #FDDCBC;">
                          <p style="margin:0;color:#555;font-size:13px;">📧 Login (email)</p>
                          <p style="margin:4px 0 0 0;color:#1a1a1a;font-size:15px;font-weight:700;">${email}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #FDDCBC;">
                          <p style="margin:0;color:#555;font-size:13px;">🔒 Senha</p>
                          <p style="margin:4px 0 0 0;color:#1a1a1a;font-size:15px;font-weight:700;font-family:monospace;background:#fff;display:inline-block;padding:4px 10px;border-radius:6px;border:1px solid #E85D04;">${password}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;">
                          <p style="margin:0;color:#555;font-size:13px;">🎯 Seu plano</p>
                          <p style="margin:4px 0 0 0;color:#C1440E;font-size:15px;font-weight:700;">${planLabel}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${memberUrl}" style="display:inline-block;background:linear-gradient(135deg,#C1440E,#E85D04);color:#ffffff;font-size:16px;font-weight:800;text-decoration:none;padding:16px 40px;border-radius:10px;">
                      Acessar Meus Moldes →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#888;font-size:13px;text-align:center;line-height:1.5;">
                Guarde este email! Você pode acessar seus moldes a qualquer momento<br/>
                em <a href="${memberUrl}" style="color:#E85D04;font-weight:700;">${memberUrl}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f5f5f5;padding:20px 32px;text-align:center;border-top:1px solid #eee;">
              <p style="margin:0;color:#aaa;font-size:12px;">
                © ${new Date().getFullYear()} Papercraft Brasil · Você recebeu este email porque realizou uma compra em nosso site.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendEmail(order) {
  const firstName = (order.name || 'cliente').split(' ')[0];
  const productName = order.product_name || order.product_id || 'Kit Papercraft';
  const planLabel = getPlanLabel(order.product_id);

  const html = buildEmailHtml({
    firstName,
    productName,
    planLabel,
    email: order.email,
    password: MEMBER_PASSWORD,
    memberUrl: MEMBER_URL,
  });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: order.email,
      subject: '🎉 Sua compra foi confirmada! Acesse seus moldes agora',
      html,
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    console.error(`  ❌ Erro ${res.status}:`, JSON.stringify(json));
    return false;
  }

  console.log(`  ✅ Email enviado (id: ${json.id})`);
  return true;
}

async function main() {
  const orders = await fetchOrders();

  if (!orders.length) {
    console.log('⚠️  Nenhum pedido pago encontrado nessa data.');
    console.log('   Tente: node scripts/resend-emails.mjs YYYY-MM-DD');
    return;
  }

  console.log(`📦 ${orders.length} pedido(s) encontrado(s):\n`);

  let ok = 0;
  let fail = 0;

  for (const order of orders) {
    const valor = order.amount ? `R$ ${(order.amount / 100).toFixed(2)}` : '?';
    console.log(`→ ${order.email} | ${order.product_id} | ${valor}`);
    const success = await sendEmail(order);
    if (success) ok++; else fail++;
  }

  console.log(`\n✅ ${ok} enviado(s) | ❌ ${fail} com erro`);
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});

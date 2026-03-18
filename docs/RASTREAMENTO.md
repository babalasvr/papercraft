# 📡 Rastreamento Avançado — Papercraft Brasil

> Como funciona o sistema de tracking server-side: Meta CAPI + UTMify + captura de UTMs

---

## 🧠 Por que rastreamento server-side?

O rastreamento tradicional (via Pixel no navegador) sofre com:
- **Ad blockers** — bloqueiam o pixel completamente
- **iOS 14+** — Apple limita tracking cross-site
- **Cookies de terceiros** — bloqueados por padrão no Safari e Firefox
- **Latência** — o evento só dispara se a página carregar por completo

O rastreamento **server-side** resolve isso: os eventos são disparados diretamente do servidor, sem depender do navegador do cliente. Resultado: **taxa de atribuição até 30% maior**.

---

## 🗺️ Visão Geral do Fluxo

```
[Cliente acessa o site]
        ↓
[Script UTMify captura UTMs na URL]
[fbc e fbp capturados dos cookies]
[IP e User-Agent coletados]
        ↓
[Cliente preenche checkout]
        ↓
[POST /api/checkout/create-pix]
  → Salva UTMs + fbc + fbp + IP no pedido (Supabase)
  → Dispara ViewContent / InitiateCheckout no Meta CAPI
        ↓
[Cliente paga o PIX]
        ↓
[Expfy dispara webhook → /api/webhook/expfy]
  → Dispara Purchase no Meta CAPI  ← server-side
  → Envia venda para UTMify         ← server-side
```

---

## 📘 Meta CAPI (Conversions API)

### O que é
A Meta Conversions API (CAPI) é uma integração direta entre o servidor e a Meta, sem passar pelo navegador. Funciona em paralelo com o Pixel do navegador.

### Arquivo: `app/lib/meta-conversions.ts`

### Eventos disparados

| Evento | Quando | Onde |
|---|---|---|
| `ViewContent` | Usuário visita a página do checkout | Front-end (Pixel) |
| `InitiateCheckout` | Usuário clica em "Pagar" | API route `/api/checkout` |
| `Purchase` | Pagamento confirmado pelo webhook | `/api/webhook/expfy` |

### Como os dados são enviados

```typescript
sendMetaEventWithName(name, {
  eventName: 'Purchase',
  eventId: purchaseEventId,     // UUID único para deduplicação
  sourceUrl: 'https://papercraft-br.shop/checkout?product=kit-mestre',
  userData: {
    email: 'cliente@email.com', // SHA-256 hashed
    phone: '5511999999999',     // SHA-256 hashed + formato BR (55...)
    cpf: '12345678900',         // SHA-256 hashed (external_id)
    fbc: '_fbc_...',            // Facebook Click ID (não hashed)
    fbp: '_fbp_...',            // Facebook Browser ID (não hashed)
    clientIpAddress: '...',     // IP do cliente
    clientUserAgent: '...',     // User-agent do navegador
  },
  customData: {
    value: 24.90,               // Valor em reais
    currency: 'BRL',
    contentIds: ['kit-mestre'],
    contents: [{ id: 'kit-mestre', quantity: 1 }],
    orderId: 'uuid-do-pedido',
  },
});
```

### Hashing de dados pessoais
A Meta exige que dados PII (email, telefone, CPF) sejam enviados em SHA-256:

```typescript
// app/lib/hash.ts
sha256('cliente@email.com') → 'a665a45920...'
sha256('5511999999999')     → 'b3a8e0e1f9...'
sha256('12345678900')       → 'f4240e1f3...'
```

### Deduplicação Pixel + CAPI
Para evitar contar o mesmo evento duas vezes (Pixel do browser + CAPI), é enviado um `event_id` único em ambos:
- **Pixel (front-end)**: `fbq('track', 'Purchase', data, { eventID: uuid })`
- **CAPI (server)**: `event_id: uuid` (mesmo UUID)

A Meta deduplica automaticamente eventos com o mesmo `event_id` dentro de 48h.

### Variáveis necessárias
```env
META_PIXEL_ID=123456789        # ID do seu Pixel
META_ACCESS_TOKEN=EAAabc...    # Token de acesso do Events Manager
```

---

## 📊 UTMify

### O que é
UTMify é uma plataforma brasileira de rastreamento de UTMs e ROI. Permite ver qual campanha/anúncio gerou cada venda.

### Arquivo: `app/lib/utmify.ts`

### Endpoint
```
POST https://api.utmify.com.br/api-credentials/orders
Header: x-api-token: SEU_TOKEN
```

### Payload enviado a cada venda

```json
{
  "orderId": "uuid-do-pedido",
  "platform": "Papercraft Brasil",
  "paymentMethod": "pix",
  "status": "paid",
  "isTest": false,
  "createdAt": "2026-03-18T15:30:00Z",
  "approvedDate": "2026-03-18T15:30:00Z",
  "refundedAt": null,
  "customer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "5511999999999",
    "document": "12345678900",
    "country": "BR"
  },
  "products": [{
    "id": "kit-mestre",
    "name": "Kit Mestre Papercraft",
    "planId": "kit-mestre",
    "planName": "Kit Mestre Papercraft",
    "quantity": 1,
    "priceInCents": 2490
  }],
  "commission": {
    "totalPriceInCents": 2490,
    "gatewayFeeInCents": 50,       // ~2% (taxa estimada do PIX)
    "userCommissionInCents": 2440  // Seu lucro líquido
  },
  "trackingParameters": {
    "utm_source": "facebook",
    "utm_medium": "cpc",
    "utm_campaign": "kit-mestre-jan",
    "utm_term": null,
    "utm_content": "video-01"
  }
}
```

### O que você vê no painel UTMify
- Vendas por campanha (utm_campaign)
- Vendas por fonte (utm_source: facebook, google, orgânico)
- ROI por anúncio
- Ticket médio
- Volume de receita por período

### Reenvio manual de vendas
Se precisar reenviar vendas antigas (ex: após configurar o token):
```bash
# Vendas de hoje
node scripts/resend-utmify.mjs

# Vendas de data específica
node scripts/resend-utmify.mjs 2026-03-18
```

### Variável necessária
```env
UTMIFY_API_TOKEN=seu_token_aqui
```

---

## 🔗 Captura de UTMs e Dados do Facebook

### Como os UTMs chegam ao servidor

```
1. Anúncio no Facebook leva para:
   papercraft-br.shop/?utm_source=facebook&utm_medium=cpc&utm_campaign=kit-mestre&fbclid=IjAXL...

2. Script UTMify no front-end captura e armazena em localStorage/cookies

3. Cliente preenche checkout → front-end envia UTMs junto com o pedido:
   POST /api/checkout/create-pix
   { email, name, cpf, phone, utm_source, utm_medium, utm_campaign, ... }

4. API salva UTMs + fbc + fbp na tabela orders do Supabase

5. Quando o webhook de pagamento chega, todos os dados já estão na ordem
   → enviados para Meta CAPI e UTMify com atribuição correta
```

### Dados capturados no checkout

| Campo | Fonte | Uso |
|---|---|---|
| `utm_source` | URL param | Meta CAPI + UTMify |
| `utm_medium` | URL param | Meta CAPI + UTMify |
| `utm_campaign` | URL param | Meta CAPI + UTMify |
| `utm_term` | URL param | Meta CAPI + UTMify |
| `utm_content` | URL param | Meta CAPI + UTMify |
| `fbc` | Cookie `_fbc` | Meta CAPI (atribuição de cliques) |
| `fbp` | Cookie `_fbp` | Meta CAPI (atribuição de browser) |
| `client_ip` | Header `x-forwarded-for` | Meta CAPI |
| `client_user_agent` | Header `user-agent` | Meta CAPI |

### O que é `fbc` e `fbp`?
- **`_fbc`** (Facebook Click ID): gerado quando o usuário clica em um anúncio do Facebook. Fica na URL como `fbclid=...` e é salvo em cookie. Identifica qual anúncio específico gerou o clique.
- **`_fbp`** (Facebook Browser ID): gerado pelo Pixel do Facebook e salvo em cookie. Identifica o navegador do usuário para atribuição.

Esses dois cookies, enviados junto com o evento CAPI, permitem que a Meta atribua a conversão ao anúncio correto mesmo sem cookies de terceiros.

---

## 🔄 Webhook Expfy — Centro do Sistema

O arquivo `app/api/webhook/expfy/route.ts` é o coração do rastreamento. Tudo passa por ele.

### Segurança
```typescript
// Verifica assinatura HMAC-SHA256 do webhook
if (process.env.EXPFY_WEBHOOK_SECRET && signature) {
  if (!verifyExpfySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
  }
}
```

### Sequência completa ao receber `payment.confirmed`

```
1. Verifica assinatura HMAC
2. Busca pedido no Supabase (por external_id ou transaction_id)
3. Atualiza status para 'paid' + registra paid_at
4. Cria ou atualiza membro na tabela members
   - Se plano iniciante comprando mestre → faz upgrade
5. Adiciona produto(s) em purchased_products (via RPC ou fallback manual)
6. [Paralelo] Email de boas-vindas (Resend)
7. [Paralelo] WhatsApp (Evolution API)
8. [Paralelo] Meta CAPI Purchase event
9. [Paralelo] UTMify ordem de venda
10. Retorna 200 OK para o Expfy
```

---

## 📐 Diagrama Completo

```
FACEBOOK ADS
     │
     │ clique no anúncio
     ▼
LANDING PAGE (papercraft-br.shop)
  • Pixel FB dispara PageView
  • UTMify script captura utm_* e fbc/fbp
     │
     │ clica em "Comprar"
     ▼
CHECKOUT PAGE
  • Pixel FB dispara ViewContent
  • CAPI dispara ViewContent (server-side)
     │
     │ preenche dados + clica em "Pagar"
     ▼
/api/checkout/create-pix
  • Salva pedido no Supabase com todos os UTMs + fbc/fbp/ip/ua
  • Cria PIX na Expfy
  • CAPI dispara InitiateCheckout
  • Retorna QR Code
     │
     │ cliente paga no banco
     ▼
EXPFY (gateway)
     │
     │ webhook POST
     ▼
/api/webhook/expfy
  ┌─────────────────────────────────┐
  │  Atualiza Supabase              │
  │  Cria membro / libera acesso    │
  └─────────────────────────────────┘
     │
     ├──► Meta CAPI Purchase (server-side)
     │      • email + phone + cpf hashed
     │      • fbc + fbp + ip + ua
     │      • valor + produto + orderId
     │      • deduplica com Pixel browser
     │
     ├──► UTMify ordem de venda
     │      • UTMs da origem
     │      • valor + comissão estimada
     │      • dados do cliente
     │
     ├──► Email (Resend)
     │      • credenciais de acesso
     │
     └──► WhatsApp (Evolution API)
            • credenciais de acesso
```

---

## ✅ Checklist de Configuração

- [ ] `META_PIXEL_ID` configurado no `.env.local`
- [ ] `META_ACCESS_TOKEN` com permissão `ads_management` + `conversions`
- [ ] Pixel instalado nas páginas (front-end)
- [ ] `EXPFY_WEBHOOK_SECRET` configurado (segurança do webhook)
- [ ] `UTMIFY_API_TOKEN` configurado no `.env.local`
- [ ] Token UTMify criado em: Integrações → Webhooks → Credenciais API
- [ ] URLs do site com UTMs nas campanhas do Facebook
- [ ] Testado com `isTest: false` no UTMify
- [ ] Meta Events Manager mostrando eventos server-side

---

## 🐛 Diagnóstico de Problemas

### Meta CAPI não está chegando
```bash
pm2 logs | grep "Meta CAPI"
# Deve mostrar: [Meta CAPI] ... ou erro específico
```
Verificar: `META_PIXEL_ID` e `META_ACCESS_TOKEN` corretos no `.env.local`

### UTMify não registrando vendas
```bash
pm2 logs | grep "UTMify"
# Deve mostrar: [UTMify] Evento enviado: uuid → paid
```
Verificar: `UTMIFY_API_TOKEN` correto. Reenviar manualmente:
```bash
node scripts/resend-utmify.mjs
```

### Webhook não disparando
```bash
pm2 logs | grep "Expfy Webhook"
# Order not found = pedido não existe no Supabase
# Invalid signature = EXPFY_WEBHOOK_SECRET errado
```

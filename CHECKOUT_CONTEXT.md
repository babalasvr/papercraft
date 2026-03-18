# Checkout Próprio — Papercraft Brasil

## Status: PIX ✅ | Cartão de Crédito ✅ (Mercado Pago implementado)

---

## O que foi implementado

### Libs (`app/lib/`)
| Arquivo | O que faz |
|---|---|
| `validators.ts` | Validação e máscara de CPF (checksum), telefone, email |
| `checkout-products.ts` | Catálogo de produtos e função `calculateTotal` (sem desconto PIX) |
| `utm.ts` | Captura UTMs no localStorage, lê cookies `_fbc` e `_fbp` do Meta Pixel |
| `hash.ts` | SHA256 para hashing de dados da Meta CAPI |
| `expfy.ts` | Cliente da API Expfy: `createPixPayment()` e `verifyExpfySignature()` |
| `meta-conversions.ts` | Envia eventos server-side para Meta CAPI com todos os parâmetros corretos (fbc, fbp, ip, user-agent, dados hasheados) |

### API Routes (`app/api/`)
| Rota | O que faz |
|---|---|
| `POST /api/checkout/create-pix` | Valida dados, cria order no Supabase, gera QR code PIX via Expfy, dispara Meta CAPI InitiateCheckout |
| `POST /api/checkout/create-card` | Tokeniza cartão via MP Brick, cria payment na API MP, cria membro se aprovado imediatamente |
| `POST /api/webhook/mercadopago` | Recebe notificação MP, valida status, atualiza order para `paid`, cria membro, dispara Meta CAPI Purchase |
| `GET /api/checkout/status?external_id=xxx` | Retorna `{ status: "pending" \| "paid" }` — usado para polling a cada 3s |
| `POST /api/webhook/expfy` | Recebe confirmação da Expfy (HMAC-SHA256), atualiza order para `paid`, cria membro no Supabase, dispara Meta CAPI Purchase |
| `POST /api/meta-event` | Proxy server-side para eventos do browser (PageView, InitiateCheckout, AddPaymentInfo) |
| `POST /api/upsell-pix` | Gera PIX para upsells pós-compra usando dados do cliente já salvos (sem re-digitar) |

### Checkout UI (`app/checkout/` e `app/components/checkout/`)
- **Layout dark theme** (`/checkout/layout.tsx`) — sem nav/footer, robots noindex
- **CheckoutForm.tsx** — orquestrador, 2 steps, captura UTMs/fbc/fbp, polling do status
- **StepIdentificacao.tsx** — nome, CPF mascarado, telefone (+55), email
- **StepPagamento.tsx** — order bump + tabs PIX/Cartão + botão finalizar
- **OrderSummary.tsx** — sidebar com produto, total, trust badges
- **CountdownBanner.tsx** — banner laranja com timer regressivo
- **PixQrCode.tsx** — QR code base64, botão copiar, spinner aguardando pagamento
- **OrderBumpCard.tsx** — checkbox Kit Impressão R$7,90
- **CreditCardForm.tsx** — **placeholder visual** (ainda não funcional)

### Upsells one-click PIX
- **UpsellPixModal.tsx** — modal que chama `/api/upsell-pix`, exibe QR, faz polling, chama `onPaid`
- Integrado em: `UpsellEvaPage`, `UpsellMetodoPage`, `UpsellCalculadoraPage`, `DownsellMetodoModal`, `DownsellCalculadoraModal`, `DownsellFinalModal`

### Outros
- **UtmCapture.tsx** — componente `'use client'` adicionado ao `app/page.tsx` que captura UTMs no mount
- **supabase-orders.sql** — SQL de migração da tabela `orders` (precisa rodar no Supabase)
- CTAs da landing page (`Pricing.tsx`, `UpsellModal.tsx`, `BackRedirect.tsx`) atualizados para `/checkout?product=...`

---

## Produtos cadastrados (`checkout-products.ts`)

| productId | Nome | Preço |
|---|---|---|
| `kit-iniciante` | Kit Iniciante | R$ 10,00 |
| `kit-mestre` | Kit Mestre | R$ 24,90 |
| `kit-mestre-desconto` | Kit Mestre (Desconto) | R$ 17,90 |
| Order Bump: `kit-impressao` | Kit Impressão Profissional | R$ 7,90 |

### Upsell products (em `/api/upsell-pix/route.ts`)

| upsellProductId | Nome | Preço |
|---|---|---|
| `pack-eva` | Pack EVA Premium | R$ 19,90 |
| `metodo-lucrar` | Método Lucrar | R$ 47,00 |
| `calculadora-precificacao` | Calculadora de Precificação | R$ 27,00 |
| `pack-animais` | Pack Animais Low Poly | R$ 9,90 |
| `metodo-lucrar-downsell` | Método Lucrar (Desconto) | R$ 19,90 |
| `calculadora-downsell` | Calculadora (Desconto) | R$ 14,90 |

---

## Variáveis de ambiente (`.env.local` e VPS)

```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
MEMBER_PASSWORD=paper123

EXPFY_PUBLIC_KEY=pk_7c4c88bb93e1ec7e52aea81cf8c8414640a3534782c85cd0
EXPFY_SECRET_KEY=sk_03b4af9f6e5c2a049fd415c2640e2b5ad95ee545b5535fb25d0a9612fb2aaeeb
EXPFY_WEBHOOK_SECRET=sk_03b4af9f6e5c2a049fd415c2640e2b5ad95ee545b5535fb25d0a9612fb2aaeeb

META_PIXEL_ID=811264998659516
META_ACCESS_TOKEN=EAAK...
NEXT_PUBLIC_META_PIXEL_ID=811264998659516
```

> ⚠️ O `.env.local` da **VPS** (`/var/www/papercraft/.env.local`) precisa ter todas essas variáveis.

---

## Pendências antes de ativar em produção

### 1. SQL no Supabase ⚠️ OBRIGATÓRIO
Rodar o arquivo `supabase-orders.sql` no **SQL Editor** do painel Supabase.
Sem isso, qualquer compra retorna erro 500.

### 2. Deploy na VPS
```bash
cd /var/www/papercraft && git pull && npm run build && pm2 restart papercraft
```

### 3. URL do Webhook na Expfy
No painel da Expfy, configurar a URL de webhook como:
```
https://papercraft-br.shop/api/webhook/expfy
```

---

## Cartão de Crédito — o que falta implementar (Mercado Pago)

### Credenciais necessárias
- **Public Key** de produção (ex: `APP_USR-...`) → vai no `.env.local` como `NEXT_PUBLIC_MP_PUBLIC_KEY`
- **Access Token** de produção (ex: `APP_USR-...`) → vai no `.env.local` como `MP_ACCESS_TOKEN`

### Pacote a instalar
```bash
npm install @mercadopago/sdk-react mercadopago
```

### Arquivos a criar

| Arquivo | O que fazer |
|---|---|
| `app/lib/mercadopago.ts` | Cliente server-side: `createCardPayment(token, amount, installments, customer)` |
| `app/api/checkout/create-card/route.ts` | Recebe token MP + dados do form, cria payment na API MP, salva order no Supabase |
| `app/api/webhook/mercadopago/route.ts` | Recebe notificação MP, valida, atualiza order para `paid`, cria membro, dispara Meta CAPI Purchase |

### Arquivos a modificar

| Arquivo | O que mudar |
|---|---|
| `app/components/checkout/CreditCardForm.tsx` | Substituir placeholder pelo `CardPayment` Brick do MP (componente oficial React) |
| `app/components/checkout/CheckoutForm.tsx` | Adicionar fluxo para cartão: aprovado → redirect upsell, pendente → tela aguardando, rejeitado → mensagem de erro |
| `app/components/checkout/StepPagamento.tsx` | Conectar submit do cartão ao `CheckoutForm` |

### Fluxo cartão (como vai funcionar)
1. Usuário seleciona "Cartão" na tab de pagamento
2. `CardPayment Brick` do MP renderiza o form (número, validade, CVV, parcelas) — **PCI compliance automático**
3. MP tokeniza o cartão no browser e retorna um `cardToken` + `paymentMethodId` + `installments`
4. `CheckoutForm` envia `POST /api/checkout/create-card` com token + dados do cliente
5. Server cria payment na API do MP com o token
6. MP retorna status: `approved` / `pending` / `rejected` / `in_process`
7. Webhook MP (`/api/webhook/mercadopago`) confirma o pagamento e libera acesso

### Variáveis de ambiente a adicionar
```env
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MP_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### URL do Webhook MP a configurar
No painel do Mercado Pago em **Suas integrações → Webhooks**:
```
https://papercraft-br.shop/api/webhook/mercadopago
```
Eventos a selecionar: `payment`

---

## Fluxo de upsells pós-compra

```
Compra concluída
    ↓
/upsell-eva?order_id={externalId}        → Pack EVA R$19,90
    ↓ (aceita ou recusa)
/upsell-metodo?order_id={externalId}     → Método Lucrar R$47,00
    ↓ (aceita ou recusa)
/upsell-calculadora?order_id={externalId} → Calculadora R$27,00
    ↓ (aceita ou recusa)
/obrigado?order_id={externalId}
```

Downsells (aparecem como modal ao recusar upsell principal):
- Recusa Método → `DownsellMetodoModal` → Método por R$19,90
- Recusa Calculadora → `DownsellCalculadoraModal` → Calculadora por R$14,90
- Recusa tudo → `DownsellFinalModal` → Pack Animais por R$9,90

---

## Infraestrutura
- **Hospedagem:** VPS Contabo — `papercraft-br.shop`
- **Process manager:** PM2 (`pm2 restart papercraft`)
- **Deploy:** `cd /var/www/papercraft && git pull && npm run build && pm2 restart papercraft`
- **Repositório:** `https://github.com/babalasvr/papercraft.git`

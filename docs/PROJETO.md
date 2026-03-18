# 📦 Papercraft Brasil — Documentação do Projeto

> Stack: Next.js 16 (App Router) · TypeScript · Supabase · Expfy · VPS Contabo · PM2

---

## 🏗️ Arquitetura Geral

```
papercraft-brasil/
├── app/
│   ├── page.tsx                    # Landing page principal
│   ├── checkout/page.tsx           # Página de checkout
│   ├── membros/page.tsx            # Área de membros (login + dashboard)
│   ├── upsell-*/page.tsx           # Páginas de upsell pós-compra
│   ├── api/
│   │   ├── checkout/               # Criação de pedidos PIX
│   │   ├── webhook/expfy/          # Webhook de confirmação de pagamento
│   │   ├── login/                  # Autenticação da área de membros
│   │   ├── member-products/        # Produtos comprados pelo membro
│   │   ├── member-pix/             # PIX para compras na área de membros
│   │   └── upsell-pix/             # PIX para upsells pós-compra
│   ├── components/
│   │   ├── checkout/               # CheckoutForm, OrderSummary, StepPagamento, etc.
│   │   ├── membros/                # MemberPixModal
│   │   ├── upsell/                 # UpsellPixModal
│   │   └── BannerTopo.tsx          # Banner superior com relógio e botão "Já sou aluno"
│   └── lib/
│       ├── supabase.ts             # Cliente Supabase (service role)
│       ├── expfy.ts                # Gateway PIX (criar pagamento + verificar assinatura)
│       ├── meta-conversions.ts     # Meta CAPI (Facebook Pixel server-side)
│       ├── utmify.ts               # UTMify (rastreamento de ROI)
│       ├── email.ts                # Resend (email pós-compra)
│       ├── whatsapp.ts             # Evolution API (WhatsApp automático)
│       ├── checkout-products.ts    # Catálogo de produtos do checkout
│       ├── upsell-products.ts      # Catálogo de produtos de upsell/área de membros
│       └── member-content.ts       # Conteúdo liberado por plano (Kit Iniciante/Mestre)
└── scripts/
    └── resend-utmify.mjs           # Script para reenviar vendas ao UTMify
```

---

## 🛒 Produtos e Planos

### Checkout Principal
| Produto | ID | Preço | Plano |
|---|---|---|---|
| Kit Iniciante Papercraft | `kit-iniciante` | R$ 10,00 | iniciante |
| Kit Mestre Papercraft | `kit-mestre` | R$ 24,90 | mestre |
| Kit Mestre (desconto) | `kit-mestre-desconto` | R$ 17,90 | mestre |
| Upgrade Kit Mestre | `kit-mestre-upgrade` | R$ 17,00 | mestre |

### Order Bump (embutido no checkout)
| Produto | ID | Preço |
|---|---|---|
| Kit Impressão Profissional | `kit-impressao` | R$ 7,90 |

### Upsells / Área de Membros
| Produto | ID | Preço |
|---|---|---|
| Pack EVA Premium | `pack-eva` | R$ 19,90 |
| Método Lucrar com Papercraft | `metodo-lucrar` | R$ 47,00 |
| Calculadora de Precificação | `calculadora-precificacao` | R$ 27,00 |
| Pack Animais Low Poly | `pack-animais` | R$ 9,90 |
| Kit Impressão Profissional | `kit-impressao` | R$ 7,90 |

---

## 💳 Fluxo de Pagamento (PIX)

```
1. Cliente preenche checkout
        ↓
2. POST /api/checkout/create-pix
   → Salva pedido no Supabase (status: pending)
   → Cria pagamento PIX na Expfy
   → Retorna QR Code + código copia-e-cola
        ↓
3. Cliente paga o PIX no banco
        ↓
4. Expfy dispara webhook → POST /api/webhook/expfy
   → Verifica assinatura HMAC
   → Atualiza pedido (status: paid)
   → Cria/atualiza membro no Supabase
   → Adiciona produto em purchased_products
   ↓ Em paralelo (falha silenciosa):
   ├── Envia email de boas-vindas (Resend)
   ├── Envia mensagem WhatsApp (Evolution API)
   ├── Dispara evento Purchase no Meta CAPI
   └── Envia venda para UTMify
```

---

## 👥 Área de Membros (`/membros`)

### Autenticação
- Login via email + senha fixa (`MEMBER_PASSWORD=paper123`)
- Sessão armazenada em `localStorage` (`papercraft_member`)
- Auto-login ao retornar ao site

### Planos
- **Kit Iniciante**: acesso às categorias básicas de moldes
- **Kit Mestre**: acesso a todas as categorias + moldes premium

### Compras dentro da área
- Botão "Adquirir" abre `MemberPixModal`
- Modal gera PIX via `/api/member-pix`
- Polling a cada 3s em `/api/member-products` para detectar pagamento
- Acesso liberado automaticamente após pagamento confirmado

---

## 🗄️ Banco de Dados (Supabase)

### Tabela `orders`
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid | PK automático |
| `external_id` | text | UUID único do pedido (nosso) |
| `transaction_id` | text | ID da transação na Expfy |
| `email` | text | Email do comprador |
| `name` | text | Nome completo |
| `cpf` | text | CPF |
| `phone` | text | Telefone |
| `product_id` | text | ID do produto |
| `product_name` | text | Nome do produto |
| `amount` | integer | Valor em centavos |
| `payment_method` | text | `pix` |
| `status` | text | `pending` → `paid` |
| `paid_at` | timestamp | Data/hora do pagamento |
| `order_bumps` | jsonb[] | Produtos do order bump |
| `utm_source` | text | UTM source capturado |
| `utm_medium` | text | UTM medium capturado |
| `utm_campaign` | text | UTM campaign capturado |
| `utm_term` | text | UTM term capturado |
| `utm_content` | text | UTM content capturado |
| `fbc` | text | Facebook click ID |
| `fbp` | text | Facebook browser ID |
| `client_ip` | text | IP do cliente |
| `client_user_agent` | text | User-agent do cliente |

### Tabela `members`
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid | PK automático |
| `email` | text | Email (único) |
| `name` | text | Nome completo |
| `plan` | text | `iniciante` ou `mestre` |
| `product_id` | text | Produto principal comprado |
| `purchased_products` | text[] | Todos os produtos comprados |
| `active` | boolean | Membro ativo |

### RPC Function
```sql
-- Adiciona produto ao array sem duplicatas
append_purchased_product(p_email text, p_product text)
```

---

## 🔧 Variáveis de Ambiente (`.env.local`)

```env
# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Expfy (gateway PIX)
EXPFY_PUBLIC_KEY=...
EXPFY_SECRET_KEY=...
EXPFY_WEBHOOK_SECRET=...

# Área de membros
MEMBER_PASSWORD=paper123

# Meta CAPI (Facebook)
META_PIXEL_ID=...
META_ACCESS_TOKEN=...

# Resend (email)
RESEND_API_KEY=re_...

# Evolution API (WhatsApp)
EVOLUTION_API_URL=...
EVOLUTION_API_KEY=...
EVOLUTION_INSTANCE=...

# UTMify
UTMIFY_API_TOKEN=...

# Site
NEXT_PUBLIC_SITE_URL=https://papercraft-br.shop
```

---

## 🚀 Deploy e Infraestrutura

- **Servidor**: VPS Contabo
- **Processo**: PM2 (`pm2 start` / `pm2 restart papercraft`)
- **Repositório**: `https://github.com/babalasvr/papercraft.git`
- **Deploy**: `git pull && npm run build && pm2 restart papercraft`

### Comandos úteis no servidor
```bash
pm2 logs --lines 50          # Ver logs em tempo real
pm2 logs | grep "Webhook"    # Filtrar logs do webhook
pm2 restart papercraft       # Reiniciar após alterar .env.local

# Reenviar vendas para UTMify (caso necessário)
node scripts/resend-utmify.mjs              # Vendas de hoje
node scripts/resend-utmify.mjs 2026-03-18  # Vendas de data específica
```

---

## 📧 Comunicação Pós-Compra

### Email (Resend)
- Enviado automaticamente após confirmação do PIX
- Contém: email de acesso, senha, plano, link para `/membros`
- Remetente: `onboarding@resend.dev` (até verificar domínio próprio)
- Apenas para produtos principais do checkout (não upsells)

### WhatsApp (Evolution API)
- Mensagem automática via Evolution API (self-hosted ou cloud)
- Mesmas informações do email: credenciais + link de acesso
- Apenas se o pedido tiver número de telefone cadastrado
- Apenas para produtos principais do checkout

---

## 🔒 Segurança

- Webhook Expfy verificado via HMAC-SHA256 (`x-signature`)
- Supabase acessado apenas via service role key (server-side)
- Senha dos membros não armazenada em texto puro no cliente
- `.env.local` não vai para o git (`.gitignore`)

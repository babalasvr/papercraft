# 🗺️ ROADMAP — Esteira de Produtos Papercraft Brasil
> Documento para implementação via Claude Code
> Projeto: `papercraft-brasil` (Next.js)
> Gateway: Cakto
> Data: 16/03/2026

---

## 📊 VISÃO GERAL DA ESTEIRA

```
[ENTRADA] → [ORDER BUMP] → [UP1] → [UP2] → [UP3] → [DS Método] → [UP4] → [DS Calc.] → [DS Final] → [EMAIL]
 R$10/24,90    R$7,90       +R$10   R$19,90  R$47,00   R$19,90      R$27,00   R$14,90      R$9,90      D+3/D+7
```

**Ticket médio potencial:** R$120+ (vs R$24,90 atual)
**Aumento de receita sem aumentar CAC:** até 5x

---

## ⚙️ ONDE CADA COISA É CONFIGURADA

| Produto | Onde configurar | Quem implementa |
|---|---|---|
| Order Bump — Kit Impressão | **Cakto** | Você mesmo |
| Upsell 1 — Upgrade Mestre | **Cakto** | Você mesmo |
| Upsell 2 — Pack EVA Premium | **Site Next.js** | Claude Code |
| Upsell 3 — Método Lucrar R$5k/mês | **Site Next.js** | Claude Code |
| Upsell 4 — Calculadora de Precificação | **Site Next.js** | Claude Code |
| Downsell Método — Método por R$19,90 | **Site Next.js** | Claude Code |
| Downsell Calculadora — Calculadora por R$14,90 | **Site Next.js** | Claude Code |
| Downsell Final — Pack Animais Low Poly R$9,90 | **Site Next.js** | Claude Code |
| Email D+3 — Pack Datas Comemorativas | **Ferramenta de email** | Você mesmo |
| Email D+7 — Molde Personalizado | **Ferramenta de email** | Você mesmo |

---

## 🛒 PRODUTO 1 — ENTRADA (já existe)

| Kit | Preço | Conteúdo | Status |
|---|---|---|---|
| Kit Iniciante | R$10,00 | 1.200 moldes | ✅ Ativo |
| Kit Mestre | R$24,90 | +3.500 moldes | ✅ Ativo |

---

## 💡 PRODUTO 2 — ORDER BUMP: KIT IMPRESSÃO (configurar na Cakto)

> ⚠️ NÃO precisa de código. Configurar no painel da Cakto.

| Campo | Valor |
|---|---|
| Nome | Kit Impressão Profissional |
| Preço | R$7,90 |
| Arquivo | `/public/Kit_Impressao_Profissional.pdf` (já existe) |
| Comportamento | Checkbox marcado por padrão (opt-out) |

**Copy do bump:**
```
✅ SIM! Quero o Kit Impressão Profissional por apenas R$7,90
Aprenda a configurar sua impressora, escolher o papel certo
e evitar os 5 erros que arruínam o papercraft. PDF imediato.
```

---

## 🚀 PRODUTO 3 — UPSELL 1: UPGRADE MESTRE (configurar na Cakto)

> ⚠️ NÃO precisa de código. Configurar no painel da Cakto.

| Campo | Valor |
|---|---|
| Aparece para | Quem comprou o Iniciante (R$10) |
| Preço | +R$10,00 (complemento — total R$20 pelo Mestre) |
| Tipo | Upsell pós-compra nativo da Cakto |

**Por que +R$10 e não R$14,90?**
- Igual ao que ele acabou de pagar → parece justo e fácil de decidir
- Total R$20 pelo Mestre → abaixo do preço normal de R$24,90
- Decisão de impulso pura: "só mais R$10 pelo kit completo?"

**Copy:**
```
🎉 Seu Kit Iniciante está confirmado!

Ei — que tal levar o Kit Mestre COMPLETO por apenas R$10 a mais?

✅ De 1.200 para +3.500 moldes
✅ Dinossauros, dragões, castelos, super-heróis
✅ Alfabeto low poly completo
✅ 7 bônus exclusivos

Você já pagou R$10 — complementa por mais R$10
e fica com tudo por apenas R$20 no total.
(Normalmente R$24,90)

[SIM! QUERO O MESTRE POR +R$10 →]
[Não obrigado, fico só com o básico]
```

---

## 🔥 PRODUTO 4 — UPSELL 2: PACK EVA PREMIUM (implementar no site)

> ✅ PRECISA DE CÓDIGO. Claude Code implementa no Next.js.

| Campo | Valor |
|---|---|
| Nome | Pack EVA Premium |
| Preço | R$19,90 |
| Aparece após | Upsell 1 (aceitou ou recusou) |
| Tipo | Página dedicada `/upsell-eva` |
| Conteúdo | 200 moldes adaptados para EVA — mesmos personagens do kit |
| Status | 🆕 Criar do zero |

**Lógica do produto:**
Quem comprou moldes de papel acabou de ter o primeiro contato com o produto.
EVA é a evolução natural: mais resistente, acabamento profissional, vende por mais.
É o upgrade de material, não de quantidade.

**Redirecionamento:**
A Cakto redireciona após Upsell 1 para:
```
https://papercraft-br.shop/upsell-eva?order_id={ORDER_ID}
```

**Estrutura da página `/upsell-eva`:**
```
1. Header urgência: "⚠️ Oferta especial — disponível por 10 minutos"
2. Timer regressivo (10 minutos)
3. Headline:
   "Você já tem os moldes de papel.
    Agora leve também os mesmos personagens em EVA."
4. Benefícios:
   ✅ Resultado 3x mais resistente que papel
   ✅ Acabamento profissional
   ✅ Mesmo processo: corta, dobra, cola
   ✅ Peças que vendem por R$80–R$300 no mercado
   ✅ 200 moldes incluídos
5. Personagens do pack:
   Dobermann, Pikachu, Dragão, Naruto, Batman,
   Lobo, Leão, Cavalo, Urso, Raposa...
6. Ancoragem de preço:
   "Uma única peça em EVA vende por R$80–R$200.
    O pack inteiro sai por R$19,90."
7. Preço: R$19,90
8. CTA verde: "SIM! QUERO O PACK EVA →"
9. Recusa discreta: "Não obrigado, só quero o papel"
   → Aceita ou recusa: redireciona para /upsell-metodo
```

**Arquivos a criar:**
```
src/app/upsell-eva/page.tsx
src/components/upsell/UpsellEvaPage.tsx
```

---

## 💼 PRODUTO 5 — UPSELL 3: MÉTODO LUCRAR COM PAPERCRAFT & EVA (implementar no site)

> ✅ PRECISA DE CÓDIGO. Claude Code implementa no Next.js.

| Campo | Valor |
|---|---|
| Nome | Método: Lucre até R$5.000/mês com Papercraft e EVA |
| Preço | R$47,00 |
| Aparece após | Upsell 2 — Pack EVA (aceitou ou recusou) |
| Tipo | Página dedicada `/upsell-metodo` |
| Conteúdo | Curso/método digital: como vender papercraft e EVA |
| Status | 🆕 Criar do zero |

**Lógica do produto:**
O comprador já tem os moldes (papel + EVA). A transição natural é:
"você tem o produto — agora aprenda a vender."
É a oferta de maior ticket e maior transformação da esteira.

**Estrutura da página `/upsell-metodo`:**
```
1. Header urgência: "⚠️ Oferta especial — disponível por 10 minutos"
2. Timer regressivo (10 minutos — mesmo componente)
3. Headline:
   "Você tem os moldes. Agora aprenda a transformar
    papel e EVA em até R$5.000 por mês."
4. Subheadline:
   "O método completo para vender papercrafts e peças em EVA
    no Instagram, Shopee e feiras — mesmo começando do zero."
5. Quebra de objeção:
   "Não precisa de experiência. Não precisa de loja física.
    Só precisa dos moldes que você acabou de comprar."
6. O que está incluído:
   ✅ Como precificar suas peças (papel e EVA)
   ✅ Onde vender: Instagram, Shopee, feiras, encomendas
   ✅ Como fotografar para vender mais
   ✅ Os 10 personagens que mais vendem
   ✅ Script de atendimento para fechar encomendas
   ✅ Como montar sua primeira vitrine digital em 1 dia
   ✅ Planilha de controle de custos e lucro
7. Ancoragem de preço:
   "Cursos de empreendedorismo custam R$300, R$500, R$1.000.
    Este método sai por R$47 — menos que 1 peça vendida."
8. Preço: R$47,00
9. Garantia: 7 dias
10. CTA verde: "SIM! QUERO APRENDER A LUCRAR →"
11. Recusa discreta: "Não obrigado, só quero os moldes"
    → Aceita ou recusa: redireciona para /upsell-calculadora
```

**Arquivos a criar:**
```
src/app/upsell-metodo/page.tsx
src/components/upsell/UpsellMetodoPage.tsx
```

---

## 🧮 PRODUTO 6 — UPSELL 4: CALCULADORA DE PRECIFICAÇÃO (implementar no site)

> ✅ PRECISA DE CÓDIGO. Claude Code implementa no Next.js.

| Campo | Valor |
|---|---|
| Nome | Calculadora de Precificação Papercraft & EVA |
| Preço | R$27,00 |
| Aparece após | Upsell 3 — Método (aceitou ou recusou) |
| Tipo | Página com ferramenta interativa `/upsell-calculadora` |
| Conteúdo | Calculadora funcional + tabela de preços de mercado |
| Status | 🆕 Criar do zero |

**Lógica do produto:**
Quem quer vender tem o problema real de não saber quanto cobrar.
Ferramenta utilitária de alto valor percebido — o cliente entende na hora para que serve.
Taxa de aceite naturalmente maior por ser algo concreto e usável no dia a dia.

**Estrutura da página `/upsell-calculadora`:**
```
1. Header urgência: "⚠️ Última oferta — disponível por 10 minutos"
2. Timer regressivo (10 minutos)
3. Headline:
   "Quanto você deve cobrar pelas suas peças?"
4. Subheadline:
   "A Calculadora de Precificação Profissional
    para Papercraft e EVA"
5. Preview animado da calculadora funcionando
6. O que a calculadora faz:
   ✅ Calcula custo de material (papel, EVA, cola, tinta)
   ✅ Calcula tempo de mão de obra
   ✅ Aplica margem de lucro automática
   ✅ Sugere preço final de venda
   ✅ Mostra preço mínimo e preço ideal
   ✅ Tabela de referência: o que o mercado cobra
   ✅ Acesso vitalício com atualizações
7. Preço: R$27,00
8. CTA verde: "SIM! QUERO A CALCULADORA →"
9. Recusa discreta: "Não obrigado" → abre DownsellModal
```

**O que o Claude Code deve construir — a calculadora:**

```typescript
// INPUTS:
- Tipo de material: [ Papel | EVA | Papel + EVA ]
- Tamanho da peça: [ Pequeno | Médio | Grande | Gigante ]
- Custo do material (R$): input numérico
- Tempo de produção (horas): input numérico
- Valor da sua hora (R$): input numérico
- Margem de lucro desejada (%): slider 10%–200%
- Taxa da plataforma (%): input numérico (ex: Shopee 16%)

// OUTPUTS AUTOMÁTICOS:
- Custo total de produção: R$ XX,XX
- Preço mínimo (sem lucro): R$ XX,XX
- Preço sugerido (com margem): R$ XX,XX
- Preço premium: R$ XX,XX
- Lucro por peça: R$ XX,XX
- Peças/mês para R$1.000: XX peças
- Peças/mês para R$5.000: XX peças

// TABELA DE REFERÊNCIA (valores fixos):
| Peça              | Tamanho | Mercado paga   |
|-------------------|---------|----------------|
| Personagem EVA    | Pequeno | R$35–R$60      |
| Personagem EVA    | Médio   | R$80–R$150     |
| Personagem EVA    | Grande  | R$150–R$300    |
| Papercraft        | Pequeno | R$15–R$30      |
| Papercraft        | Médio   | R$40–R$80      |
| Papercraft        | Grande  | R$80–R$160     |
| Cabeça gigante    | Grande  | R$200–R$500    |
```

**Arquivos a criar:**
```
src/app/upsell-calculadora/page.tsx
src/components/upsell/UpsellCalculadoraPage.tsx
src/components/upsell/PrecificacaoCalculator.tsx  ← calculadora interativa
```

---

## ↩️ PRODUTO 7 — DOWNSELLS (implementar no site)

> ✅ PRECISA DE CÓDIGO. Claude Code implementa no Next.js.
> São 3 modais de downsell separados, cada um com preço e gatilho diferente.

---

### DOWNSELL 1 — Método por R$19,90

| Campo | Valor |
|---|---|
| Aparece quando | Usuário recusa o Upsell 3 (Método R$47) |
| Preço | R$19,90 (desconto de R$27,10 vs preço normal) |
| Tipo | Modal sobre a página /upsell-metodo |

**Copy do modal:**
```
Espera! Que tal um desconto especial?

O Método completo por apenas R$19,90
(era R$47,00 — desconto de 58% só agora)

✅ Como vender no Instagram e Shopee
✅ Os 10 personagens que mais vendem
✅ Script de atendimento para fechar encomendas
✅ Planilha de custos e lucro

[SIM! QUERO POR R$19,90 →]
[Não obrigado, dispensar]
```

**Arquivo a criar:**
```
src/components/upsell/DownsellMetodoModal.tsx
```

---

### DOWNSELL 2 — Calculadora por R$14,90

| Campo | Valor |
|---|---|
| Aparece quando | Usuário recusa o Upsell 4 (Calculadora R$27) |
| Preço | R$14,90 (desconto de R$12,10 vs preço normal) |
| Tipo | Modal sobre a página /upsell-calculadora |

**Copy do modal:**
```
Espera! Que tal um desconto especial?

A Calculadora de Precificação por apenas R$14,90
(era R$27,00 — desconto de 44% só agora)

✅ Descubra exatamente quanto cobrar
✅ Nunca mais venda abaixo do custo
✅ Tabela de preços de mercado incluída
✅ Acesso vitalício

[SIM! QUERO POR R$14,90 →]
[Não obrigado, dispensar]
```

**Arquivo a criar:**
```
src/components/upsell/DownsellCalculadoraModal.tsx
```

---

### DOWNSELL FINAL — Pack Animais R$9,90

| Campo | Valor |
|---|---|
| Aparece quando | Usuário recusa o Downsell da Calculadora |
| Preço | R$9,90 |
| Tipo | Modal final (última oferta da esteira) |

**Copy do modal:**
```
Última oferta antes de acessar seus moldes...

Que tal o Pack Animais Low Poly?
50 moldes dos bichos mais pedidos por R$9,90.

Leão, Lobo, Urso, Raposa, Elefante...

[SIM, QUERO POR R$9,90 →]
[Não, obrigado — acessar meus moldes]
```

**Arquivo a criar:**
```
src/components/upsell/DownsellFinalModal.tsx
```

---

## 📧 PRODUTO 8 — EMAILS PÓS-COMPRA (configurar na ferramenta de email)

> ⚠️ NÃO precisa de código no site.

**Sequência:**
```
D+0 → Boas-vindas + link de acesso aos moldes
D+1 → Dica: "Como fazer seu primeiro papercraft perfeito"
D+3 → Oferta: Pack Datas Comemorativas R$14,90
       (Natal, Páscoa, Dia das Mães, Halloween, São João)
D+7 → Oferta: Molde Personalizado Sob Encomenda R$39,90
       ("Qual personagem você quer que a gente faça?")
```

---

## 🗂️ ARQUIVOS A CRIAR NO SITE

```
papercraft-brasil/
├── src/
│   ├── app/
│   │   ├── upsell-eva/
│   │   │   └── page.tsx                      ← CRIAR
│   │   ├── upsell-metodo/
│   │   │   └── page.tsx                      ← CRIAR
│   │   └── upsell-calculadora/
│   │       └── page.tsx                      ← CRIAR
│   └── components/
│       └── upsell/
│           ├── CountdownTimer.tsx            ← CRIAR (timer reutilizável 10min)
│           ├── UpsellEvaPage.tsx             ← CRIAR
│           ├── UpsellMetodoPage.tsx          ← CRIAR
│           ├── UpsellCalculadoraPage.tsx     ← CRIAR
│           ├── PrecificacaoCalculator.tsx    ← CRIAR (calculadora interativa)
│           ├── DownsellMetodoModal.tsx       ← CRIAR (Método por R$19,90)
│           ├── DownsellCalculadoraModal.tsx  ← CRIAR (Calculadora por R$14,90)
│           └── DownsellFinalModal.tsx        ← CRIAR (Pack Animais R$9,90)
```

---

## 🔄 FLUXO COMPLETO DE REDIRECIONAMENTO

```
Usuário compra Iniciante (R$10) ou Mestre (R$24,90)
            ↓
[ORDER BUMP] Kit Impressão R$7,90 ← CAKTO
            ↓
Pagamento confirmado
            ↓
[UPSELL 1] Upgrade Mestre +R$10 ← CAKTO
    ├── ACEITA ou RECUSA
            ↓
Cakto redireciona → /upsell-eva?order_id={ID}
            ↓
[UPSELL 2] Pack EVA R$19,90 ← SITE
    ├── ACEITA → /upsell-metodo
    └── RECUSA → /upsell-metodo
            ↓
[UPSELL 3] Método Lucrar R$47 ← SITE
    ├── ACEITA → /upsell-calculadora
    └── RECUSA → abre DownsellMetodoModal (R$19,90)
                    ├── ACEITA → /upsell-calculadora
                    └── RECUSA → /upsell-calculadora
            ↓
[UPSELL 4] Calculadora R$27 ← SITE
    ├── ACEITA → /obrigado
    └── RECUSA → abre DownsellCalculadoraModal (R$14,90)
                    ├── ACEITA → /obrigado
                    └── RECUSA → abre DownsellFinalModal (R$9,90)
            ↓
[DOWNSELL FINAL] Pack Animais R$9,90 ← SITE
    ├── ACEITA → /obrigado
    └── RECUSA → /obrigado
            ↓
/obrigado (entrega de tudo que foi comprado)
            ↓
[EMAIL D+3] Pack Datas R$14,90
[EMAIL D+7] Molde Personalizado R$39,90
```

---

## 🎯 PRIORIDADE DE IMPLEMENTAÇÃO

| # | Feature | Onde | Dificuldade | Quando |
|---|---|---|---|---|
| 1 | Order Bump Kit Impressão | **Cakto** | Muito fácil | **Hoje** |
| 2 | Upsell 1 Mestre +R$10 | **Cakto** | Fácil | **Hoje** |
| 3 | CountdownTimer reutilizável | **Site** | Fácil | Semana 1 |
| 4 | Página /upsell-eva | **Site** | Médio | Semana 1 |
| 5 | Página /upsell-metodo | **Site** | Médio | Semana 1 |
| 6 | Página /upsell-calculadora + Calculadora | **Site** | Médio-Alto | Semana 1 |
| 7 | DownsellMetodoModal (R$19,90) | **Site** | Fácil | Semana 1 |
| 8 | DownsellCalculadoraModal (R$14,90) | **Site** | Fácil | Semana 1 |
| 9 | DownsellFinalModal Pack Animais (R$9,90) | **Site** | Fácil | Semana 1 |
| 8 | Sequência de emails | **Email** | Médio | Semana 2 |

---

## 📊 TICKET MÉDIO POTENCIAL

| Cenário | Produtos adquiridos | Ticket |
|---|---|---|
| Mínimo | Kit Mestre | R$24,90 |
| Básico | Mestre + Impressão | R$32,80 |
| Médio | Mestre + Impressão + EVA | R$52,70 |
| Avançado | Mestre + Impressão + EVA + Método | R$99,70 |
| Máximo | Mestre + Impressão + EVA + Método + Calc. | R$126,70 |

---

## 📊 MÉTRICAS PARA ACOMPANHAR

| Etapa | Meta de aceite | Impacto no ticket |
|---|---|---|
| Order Bump Kit Impressão | > 35% | +R$7,90 |
| Upsell 1 Mestre | > 25% | +R$10,00 |
| Upsell 2 EVA | > 20% | +R$19,90 |
| Upsell 3 Método | > 15% | +R$47,00 |
| Upsell 4 Calculadora | > 30% | +R$27,00 |
| Downsell Método | > 25% | +R$19,90 |
| Downsell Calculadora | > 25% | +R$14,90 |
| Downsell Final Pack Animais | > 15% | +R$9,90 |

---

## 🗒️ NOTAS PARA O CLAUDE CODE

> Implementar apenas o que está no site: /upsell-eva, /upsell-metodo,
> /upsell-calculadora, CountdownTimer, DownsellModal e PrecificacaoCalculator.
> Order Bump e Upsell 1 são configurados na Cakto pelo dono do produto.

1. Projeto é **Next.js 14+ com App Router** em `C:\Users\Balas\Desktop\papercraft\papercraft-brasil`
2. Fonte dos títulos: **Permanent Marker** (Google Fonts) — manter identidade visual da LP
3. Cor dos botões de aceite: **#22C55E** (verde) — igual ao restante do site
4. Botões de recusa: texto simples e discreto, sem cor de destaque
5. Todas as páginas devem ser **mobile-first 9:16** — maioria vem de Reels/Stories
6. O `order_id` chega como query param na URL — preservar ao redirecionar entre páginas
7. Timer de 10 minutos: componente reutilizável, quando expirar redireciona para `/obrigado`
8. A calculadora deve funcionar 100% no client-side (sem API) — cálculos em JS puro
9. Pixel do Meta deve disparar evento `Purchase` com o valor correto em cada upsell aceito
10. Verificar na Cakto qual é a URL de redirect configurável após o Upsell 1 — apontar para `/upsell-eva`
11. O projeto já tem BackRedirect funcionando — garantir que as páginas de upsell não acionem ele

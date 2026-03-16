import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// ── Produtos principais → plano da área de membros ───────────────────────────
const PRODUCT_PLAN_MAP: Record<string, "iniciante" | "mestre"> = {
  // IDs Cakto → usar offer.id do payload (ex: body.data.offer.id)
  "4ptqmkr":   "mestre",    // Kit Mestre R$24,90
  inwgjhy:     "mestre",    // Kit Mestre R$17,90 (upsell/saída)
  fdro8ye:     "iniciante", // Kit Iniciante R$10,00
  "bu34t3v":   "mestre",    // Kit Profissional
  // IDs legados GGCheckout (manter por segurança)
  KA96Dlg6MKnkPnP3HEZv:   "mestre",
  bDk2mvoTRD0ho6gLKqWa:   "mestre",
  vFuC4CfrH3VzK1O0too:    "iniciante",
  WrN9zpJBasFtfyQqR9vs:   "iniciante",
  "2mLxvXet6aDg93bgZkOu": "mestre",
  h7JvWtkZwpmVHbusw4u6:   "mestre",
};

// ── Upsells/order bumps → product_id interno (tabela member_products) ─────────
// TODO: substituir as chaves pelos offer.id reais da Cakto após criar as ofertas
const UPSELL_PRODUCT_MAP: Record<string, string> = {
  // "CAKTO_OFFER_ID": "product_id_interno"
  // "": "pack-eva",           // Pack EVA Premium R$19,90
  // "": "metodo-lucrar",      // Método Lucrar R$47,00
  // "": "metodo-lucrar",      // Downsell Método R$19,90 (mesmo produto)
  // "": "calculadora-precificacao", // Calculadora R$27,00
  // "": "calculadora-precificacao", // Downsell Calculadora R$14,90 (mesmo produto)
  // "": "pack-animais",       // Pack Animais Low Poly R$9,90
  // "": "kit-impressao",      // Kit Impressão Profissional R$7,90 (order bump)
};

const REVOKE_EVENTS = new Set(["refund", "chargeback"]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const event = body.event || body.event_type || "";

    // Cakto envolve tudo em body.data; GGCheckout envia direto em body
    const d = body.data ?? body;

    // ── REEMBOLSO / CHARGEBACK → revogar acesso ──────────────────────
    if (REVOKE_EVENTS.has(event)) {
      const email = d.customer?.email || d.email || d.buyer?.email;

      if (!email) {
        return NextResponse.json(
          { error: "Email é obrigatório" },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("members")
        .update({ active: false })
        .eq("email", email.toLowerCase());

      if (error) {
        console.error("Supabase revoke error:", error);
        return NextResponse.json(
          { error: "Erro ao revogar acesso" },
          { status: 500 }
        );
      }

      console.log(`Acesso revogado (${event}): ${email}`);
      return NextResponse.json({ success: true, action: "revoked" });
    }

    // ── Ignorar outros eventos que não sejam compra aprovada ──────────
    if (event && event !== "purchase_approved") {
      return NextResponse.json({ success: true, action: "ignored" });
    }

    // ── COMPRA APROVADA → liberar acesso ─────────────────────────────
    const email = d.customer?.email || d.email || d.buyer?.email;
    const name  = d.customer?.name  || d.name  || d.buyer?.name || "";
    // Cakto: usar offer.id (ex: "4ptqmkr") — NÃO product.short_id
    const offerId =
      d.offer?.id         ||
      d.product?.short_id ||
      d.product?.id       ||
      d.product_id        ||
      d.productId         ||
      "";

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const actions: string[] = [];

    // ── 1. Verificar se é upsell/order bump ──────────────────────────────────
    const upsellProductId = UPSELL_PRODUCT_MAP[offerId];

    if (upsellProductId) {
      // É um produto de upsell — adicionar ao array purchased_products do membro
      // Usa uma função RPC para append atômico sem duplicatas
      const { error: upsellError } = await supabase.rpc(
        "append_purchased_product",
        {
          p_email: normalizedEmail,
          p_product: upsellProductId,
        }
      );

      if (upsellError) {
        // Fallback: atualizar via SELECT + UPDATE manual
        const { data: member } = await supabase
          .from("members")
          .select("purchased_products")
          .eq("email", normalizedEmail)
          .single();

        const current: string[] = member?.purchased_products ?? [];
        if (!current.includes(upsellProductId)) {
          const { error: updateError } = await supabase
            .from("members")
            .update({ purchased_products: [...current, upsellProductId] })
            .eq("email", normalizedEmail);

          if (updateError) {
            console.error("Supabase upsell update error:", updateError);
            return NextResponse.json(
              { error: "Erro ao registrar produto" },
              { status: 500 }
            );
          }
        }
      }

      console.log(`Upsell registrado: ${normalizedEmail} → ${upsellProductId}`);
      actions.push(`upsell:${upsellProductId}`);

      return NextResponse.json({ success: true, action: actions.join(",") });
    }

    // ── 2. É produto principal → liberar área de membros ─────────────────────
    const plan = PRODUCT_PLAN_MAP[offerId] || "iniciante";

    // Verificar se membro já existe
    const { data: existing } = await supabase
      .from("members")
      .select("id, plan")
      .eq("email", normalizedEmail)
      .single();

    if (existing) {
      // Reativar caso estivesse revogado + upgrade de plano se necessário
      const updates: Record<string, unknown> = { active: true };
      if (existing.plan === "iniciante" && plan === "mestre") {
        updates.plan = "mestre";
        updates.product_id = offerId;
      }
      await supabase
        .from("members")
        .update(updates)
        .eq("id", existing.id);

      actions.push("updated");
      return NextResponse.json({ success: true, action: actions.join(",") });
    }

    // Inserir novo membro
    const { error } = await supabase.from("members").insert({
      email: normalizedEmail,
      name,
      plan,
      product_id: offerId,
      active: true,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Erro ao cadastrar membro" },
        { status: 500 }
      );
    }

    actions.push("created");
    return NextResponse.json({ success: true, action: actions.join(",") });
  } catch {
    return NextResponse.json(
      { error: "Payload inválido" },
      { status: 400 }
    );
  }
}

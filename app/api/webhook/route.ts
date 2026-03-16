import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

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
    const productId =
      d.offer?.id      ||
      d.product?.short_id ||
      d.product?.id    ||
      d.product_id     ||
      d.productId      ||
      "";

    const plan = PRODUCT_PLAN_MAP[productId] || "iniciante";

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se membro já existe
    const { data: existing } = await supabase
      .from("members")
      .select("id, plan")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      // Reativar caso estivesse revogado + upgrade de plano se necessário
      const updates: Record<string, unknown> = { active: true };
      if (existing.plan === "iniciante" && plan === "mestre") {
        updates.plan = "mestre";
        updates.product_id = productId;
      }
      await supabase
        .from("members")
        .update(updates)
        .eq("id", existing.id);

      return NextResponse.json({ success: true, action: "updated" });
    }

    // Inserir novo membro
    const { error } = await supabase.from("members").insert({
      email: email.toLowerCase(),
      name,
      plan,
      product_id: productId,
      active: true,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Erro ao cadastrar membro" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, action: "created" });
  } catch {
    return NextResponse.json(
      { error: "Payload inválido" },
      { status: 400 }
    );
  }
}

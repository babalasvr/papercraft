import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

const PRODUCT_PLAN_MAP: Record<string, "iniciante" | "mestre"> = {
  // IDs Cakto (short_id da URL de checkout)
  "4ptqmkr_807214": "mestre",    // Kit Mestre R$24,90
  inwgjhy:          "mestre",    // Kit Mestre R$17,90 (upsell/saída)
  fdro8ye:          "iniciante", // Kit Iniciante R$10,00
  bu34t3v_807226:   "mestre",    // Kit Profissional
  // IDs legados GGCheckout (manter por segurança)
  KA96Dlg6MKnkPnP3HEZv:  "mestre",
  bDk2mvoTRD0ho6gLKqWa:  "mestre",
  vFuC4CfrH3VzK1O0too:   "iniciante",
  WrN9zpJBasFtfyQqR9vs:  "iniciante",
  "2mLxvXet6aDg93bgZkOu": "mestre",
  h7JvWtkZwpmVHbusw4u6:  "mestre",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Ignorar eventos que não sejam compra aprovada
    const event = body.event || body.event_type || "";
    if (event && event !== "purchase_approved") {
      return NextResponse.json({ success: true, action: "ignored" });
    }

    // Cakto: customer.email / customer.name / product.short_id ou product.id
    const email =
      body.customer?.email || body.email || body.buyer?.email;
    const name =
      body.customer?.name || body.name || body.buyer?.name || "";
    const productId =
      body.product?.short_id ||
      body.product?.id ||
      body.product_id ||
      body.productId ||
      "";

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    const plan = PRODUCT_PLAN_MAP[productId] || "iniciante";

    // Check if member already exists
    const { data: existing } = await supabase
      .from("members")
      .select("id, plan")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      // Upgrade to mestre if they had iniciante
      if (existing.plan === "iniciante" && plan === "mestre") {
        await supabase
          .from("members")
          .update({ plan: "mestre", product_id: productId })
          .eq("id", existing.id);
      }
      return NextResponse.json({ success: true, action: "updated" });
    }

    // Insert new member
    const { error } = await supabase.from("members").insert({
      email: email.toLowerCase(),
      name,
      plan,
      product_id: productId,
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

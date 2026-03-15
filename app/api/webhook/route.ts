import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

const PRODUCT_PLAN_MAP: Record<string, "iniciante" | "mestre"> = {
  // IDs reais do GGCheckout
  KA96Dlg6MKnkPnP3HEZv: "mestre",   // Mega pack +3500 moldes R$24,90
  bDk2mvoTRD0ho6gLKqWa: "mestre",   // (cópia) Mega pack +3500 moldes R$17,90
  vFuC4CfrH3VzK1O0too:  "iniciante", // Pack 1200 moldes R$10
  // IDs legados (manter por segurança)
  WrN9zpJBasFtfyQqR9vs: "iniciante",
  "2mLxvXet6aDg93bgZkOu": "mestre",
  h7JvWtkZwpmVHbusw4u6: "mestre",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = body.email || body.customer?.email || body.buyer?.email;
    const name = body.name || body.customer?.name || body.buyer?.name || "";
    const productId =
      body.product_id || body.productId || body.product?.id || "";

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

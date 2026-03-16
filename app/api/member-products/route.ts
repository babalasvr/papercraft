import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// GET: Fetch products owned by a member
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email é obrigatório" },
      { status: 400 }
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  const { data, error } = await supabase
    .from("member_products")
    .select("product_id")
    .eq("email", normalizedEmail);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }

  const productIds = (data || []).map((row) => row.product_id);

  return NextResponse.json({ products: productIds });
}

// POST: Add a product to a member's purchases
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, product_id } = body;

    if (!email || !product_id) {
      return NextResponse.json(
        { error: "Email e product_id são obrigatórios" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { error } = await supabase.from("member_products").upsert(
      {
        email: normalizedEmail,
        product_id,
        purchased_at: new Date().toISOString(),
      },
      { onConflict: "email,product_id" }
    );

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Erro ao salvar produto" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}

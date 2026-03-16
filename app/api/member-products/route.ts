import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// GET: Busca produtos comprados pelo membro (coluna purchased_products em members)
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
    .from("members")
    .select("purchased_products")
    .eq("email", normalizedEmail)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = not found, ignorar
    console.error("Supabase error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }

  const products: string[] = data?.purchased_products ?? [];

  return NextResponse.json({ products });
}

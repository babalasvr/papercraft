import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (password !== process.env.MEMBER_PASSWORD) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 401 }
      );
    }

    const { data: member, error } = await supabase
      .from("members")
      .select("name, plan, active")
      .eq("email", email.toLowerCase())
      .single();

    if (error || !member) {
      return NextResponse.json(
        { error: "Email não encontrado. Verifique se usou o mesmo email da compra." },
        { status: 404 }
      );
    }

    if (!member.active) {
      return NextResponse.json(
        { error: "Acesso revogado. Entre em contato pelo suporte." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      name: member.name,
      plan: member.plan,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro no servidor" },
      { status: 500 }
    );
  }
}

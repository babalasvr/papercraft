"use client";

import { useState, useEffect } from "react";
import { LogOut, ExternalLink, Lock, Mail, Scissors } from "lucide-react";
import { memberContent, type CategoryCard } from "@/app/lib/member-content";

type MemberData = {
  name: string;
  plan: "iniciante" | "mestre";
};

export default function MembrosPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<MemberData | null>(null);
  const [checkingStorage, setCheckingStorage] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("papercraft_member");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.email) {
          setEmail(data.email);
          // Auto-login with saved email
          handleLogin(data.email, "paper123");
        }
      } catch {
        localStorage.removeItem("papercraft_member");
      }
    }
    setCheckingStorage(false);
  }, []);

  async function handleLogin(loginEmail?: string, loginPassword?: string) {
    const useEmail = loginEmail || email;
    const usePassword = loginPassword || password;

    if (!useEmail || !usePassword) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: useEmail, password: usePassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        localStorage.removeItem("papercraft_member");
        setLoading(false);
        return;
      }

      setMember({ name: data.name, plan: data.plan });
      localStorage.setItem(
        "papercraft_member",
        JSON.stringify({ email: useEmail })
      );
    } catch {
      setError("Erro de conexão. Tente novamente.");
    }
    setLoading(false);
  }

  function handleLogout() {
    setMember(null);
    setEmail("");
    setPassword("");
    localStorage.removeItem("papercraft_member");
  }

  if (checkingStorage) {
    return (
      <div className="min-h-screen grid-paper-bg flex items-center justify-center">
        <div className="animate-bounce-slow">
          <Scissors className="w-10 h-10 text-primary" />
        </div>
      </div>
    );
  }

  // ── LOGIN SCREEN ──
  if (!member) {
    return (
      <div className="min-h-screen grid-paper-bg flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Polaroid login card */}
          <div className="polaroid rounded-2xl">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-marker text-3xl text-foreground mb-2">
                  Área de Membros
                </h1>
                <p className="text-muted text-sm">
                  Acesse seus moldes de papercraft
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Email da compra
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-white text-foreground"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-white text-foreground"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="cta-button w-full py-3.5 rounded-xl font-bold text-lg text-center cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>

              <p className="text-center text-xs text-muted mt-6">
                Use o email que você utilizou na compra.
                <br />A senha padrão é enviada junto com sua compra.
              </p>
            </div>
          </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <a
              href="/"
              className="text-primary text-sm font-semibold hover:underline"
            >
              ← Voltar para o site
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──
  const cards = memberContent[member.plan] || [];
  const firstName = member.name?.split(" ")[0] || "Membro";

  return (
    <div className="min-h-screen grid-paper-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-marker text-2xl text-foreground">
              Olá, {firstName}! ✂️
            </h1>
            <span
              className={`inline-block mt-1 text-xs font-bold px-3 py-1 rounded-full ${
                member.plan === "mestre"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                  : "bg-blue-100 text-blue-800 border border-blue-300"
              }`}
            >
              {member.plan === "mestre" ? "⭐ Kit Mestre" : "📦 Kit Iniciante"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted hover:text-red-500 transition-colors text-sm font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="font-marker text-2xl text-foreground mb-2">
            Seus Moldes
          </h2>
          <p className="text-muted">
            Clique em uma categoria para acessar os moldes no Google Drive
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card: CategoryCard) => (
            <a
              key={card.title}
              href={card.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group polaroid rounded-2xl hover:scale-[1.02] transition-transform duration-200 cursor-pointer relative"
            >
              {/* Bonus badge */}
              {card.isBonus && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full border-2 border-yellow-500 z-10 rotate-6">
                  BÔNUS
                </div>
              )}

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 h-full flex flex-col">
                {/* Icon */}
                <div className="text-4xl mb-3">{card.icon}</div>

                {/* Title */}
                <h3 className="font-marker text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-muted text-sm mb-4 flex-1">
                  {card.description}
                </p>

                {/* Action */}
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <ExternalLink className="w-4 h-4" />
                  Acessar Moldes
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Kit Impressao Profissional upsell */}
        <div className="mt-8 polaroid rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 text-5xl">🖨️</div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-marker text-xl text-foreground mb-1">
                Kit Impressão Profissional
              </h3>
              <p className="text-muted text-sm mb-3">
                Configurações exatas de impressora, papéis certos e técnicas de corte para seus moldes ficarem perfeitos na primeira tentativa.
              </p>
              <a
                href="/kit-impressao"
                className="cta-button px-6 py-2.5 rounded-xl font-bold text-sm inline-block"
              >
                Ver Oferta Especial →
              </a>
            </div>
          </div>
        </div>

        {/* Upgrade CTA for iniciante */}
        {member.plan === "iniciante" && (
          <div className="mt-12 polaroid rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 p-8 text-center">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="font-marker text-2xl text-foreground mb-2">
                Faça Upgrade para o Kit Mestre!
              </h3>
              <p className="text-muted mb-2">
                Desbloqueie os <strong className="text-foreground">Moldes Premium</strong> com
                Castelos, Alfabeto, Dinossauros, Coisas Fofas e muito mais!
              </p>
              <p className="text-muted text-sm mb-6">
                Por apenas{" "}
                <strong className="text-foreground text-lg">R$ 17</strong> você
                acessa todo o conteúdo exclusivo do Kit Mestre.
              </p>
              <a
                href="https://ggcheckout.com.br/checkout/v4/h7JvWtkZwpmVHbusw4u6"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button px-8 py-4 rounded-xl font-bold text-lg inline-block"
              >
                Upgrade para Kit Mestre — R$ 17 →
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-muted">
        Papercraft Brasil © {new Date().getFullYear()} — Todos os direitos
        reservados
      </footer>
    </div>
  );
}

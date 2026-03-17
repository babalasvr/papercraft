"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, ArrowLeft, Scissors } from "lucide-react";

const ANIMAIS_ITEMS = [
  {
    title: "Moldes Safari",
    icon: "🦁",
    description: "Leão, girafa, elefante, zebra e muito mais — animais do safari em EVA low poly",
    url: "https://drive.google.com/drive/folders/1q599_g6IDNgZKdYS2T4LQ5GF2S_KcuLl",
  },
  {
    title: "Moldes Ursinhos",
    icon: "🐻",
    description: "Ursinhos fofos em diversas versões — perfeitos para festas e maternidades",
    url: "https://drive.google.com/drive/folders/1tNoaDMYFba6hROeFIfl-NnQWuWYOGooM",
  },
];

export default function PackAnimaisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const saved = localStorage.getItem("papercraft_member");
      if (!saved) { router.replace("/membros"); return; }
      try {
        const { email } = JSON.parse(saved);
        if (!email) { router.replace("/membros"); return; }
        const res = await fetch(`/api/member-products?email=${encodeURIComponent(email)}`);
        if (!res.ok) { router.replace("/membros"); return; }
        const data = await res.json();
        if (!(data.products || []).includes("pack-animais")) {
          router.replace("/membros"); return;
        }
        setAuthorized(true);
      } catch { router.replace("/membros"); }
      finally { setLoading(false); }
    }
    checkAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen grid-paper-bg flex items-center justify-center">
        <div className="animate-bounce-slow">
          <Scissors className="w-10 h-10 text-primary" />
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen grid-paper-bg">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push("/membros")}
            className="flex items-center gap-2 text-muted hover:text-primary transition-colors text-sm font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div>
            <h1 className="font-marker text-2xl text-foreground">
              🦁 Pack Animais Low Poly
            </h1>
            <p className="text-muted text-xs mt-0.5">
              {ANIMAIS_ITEMS.length} categorias de moldes
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-muted">
            Clique em uma categoria para acessar os moldes no Google Drive
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ANIMAIS_ITEMS.map((item) => (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group polaroid rounded-2xl hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 h-full flex flex-col">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-marker text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted text-sm mb-4 flex-1">{item.description}</p>
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <ExternalLink className="w-4 h-4" />
                  Acessar Moldes
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-muted">
        Papercraft Brasil © {new Date().getFullYear()} — Todos os direitos reservados
      </footer>
    </div>
  );
}

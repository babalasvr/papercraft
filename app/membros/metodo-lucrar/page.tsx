"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, ArrowLeft, Scissors, Clock } from "lucide-react";

type MetodoItem = {
  title: string;
  icon: string;
  description: string;
  url: string | null; // null = em breve
};

const METODO_ITEMS: MetodoItem[] = [
  {
    title: "Como Vender seus Trabalhos na Internet",
    icon: "🌐",
    description: "Estratégias completas para vender papercrafts e EVA online",
    url: "https://drive.google.com/drive/folders/1MiEfiiLVH1DOG0x1dSKr1qYLxzkv2qk6",
  },
  {
    title: "Lista de Fornecedores Online",
    icon: "📋",
    description: "Os melhores fornecedores de EVA, papel e materiais com preço de atacado",
    url: "https://drive.google.com/drive/folders/1s6SI1rOJcNJ7OkCGZ_NaFc8SoHeYFeL4",
  },
  {
    title: "Venda no Instagram",
    icon: "📱",
    description: "Como usar o Instagram para atrair clientes e fechar encomendas todos os dias",
    url: "https://drive.google.com/drive/folders/1vkG1Jw_yu6xWqwMbEBWW0YzfohWpaGJY",
  },
  {
    title: "Checklist do Plano R$2.000/mês com EVA",
    icon: "✅",
    description: "Passo a passo do zero até os primeiros R$2.000 vendendo peças em EVA",
    url: null,
  },
  {
    title: "Artesanato em E.V.A — Passo a Passo",
    icon: "🎨",
    description: "Tutoriais completos de produção em EVA do iniciante ao avançado",
    url: null,
  },
  {
    title: 'E-book "11 Ideias para Lucrar com Artesanato"',
    icon: "📖",
    description: "11 formas práticas e testadas de transformar seu artesanato em renda",
    url: null,
  },
  {
    title: "Guia de Materiais de Feltro",
    icon: "🧶",
    description: "Tudo sobre feltro: tipos, onde comprar, como usar e combinações de cores",
    url: null,
  },
  {
    title: "Etiquetas Editáveis Profissionais",
    icon: "🏷️",
    description: "Modelos de etiquetas prontos para editar e usar nos seus produtos",
    url: null,
  },
];

export default function MetodoLucrarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const saved = localStorage.getItem("papercraft_member");
      if (!saved) {
        router.replace("/membros");
        return;
      }

      try {
        const { email } = JSON.parse(saved);
        if (!email) {
          router.replace("/membros");
          return;
        }

        const res = await fetch(
          `/api/member-products?email=${encodeURIComponent(email)}`
        );
        if (!res.ok) {
          router.replace("/membros");
          return;
        }

        const data = await res.json();
        const products: string[] = data.products || [];

        if (!products.includes("metodo-lucrar")) {
          router.replace("/membros");
          return;
        }

        setAuthorized(true);
      } catch {
        router.replace("/membros");
      } finally {
        setLoading(false);
      }
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

  const available = METODO_ITEMS.filter((i) => i.url !== null);
  const soon = METODO_ITEMS.filter((i) => i.url === null);

  return (
    <div className="min-h-screen grid-paper-bg">
      {/* Header */}
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
              💼 Método Lucrar com Papercraft
            </h1>
            <p className="text-muted text-xs mt-0.5">
              {METODO_ITEMS.length} materiais incluídos
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Disponíveis */}
        <div className="mb-8">
          <p className="text-muted">
            Clique em um material para acessar no Google Drive
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {available.map((item) => (
            <a
              key={item.title}
              href={item.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="group polaroid rounded-2xl hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 h-full flex flex-col">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-marker text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted text-sm mb-4 flex-1">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <ExternalLink className="w-4 h-4" />
                  Acessar Material
                </div>
              </div>
            </a>
          ))}

          {/* Em breve */}
          {soon.map((item) => (
            <div
              key={item.title}
              className="polaroid rounded-2xl opacity-70"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 h-full flex flex-col">
                <div className="text-4xl mb-3 grayscale">{item.icon}</div>
                <h3 className="font-marker text-lg text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted text-sm mb-4 flex-1">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-muted font-semibold text-sm">
                  <Clock className="w-4 h-4" />
                  Em breve
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-muted">
        Papercraft Brasil © {new Date().getFullYear()} — Todos os direitos
        reservados
      </footer>
    </div>
  );
}

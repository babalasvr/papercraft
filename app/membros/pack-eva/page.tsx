"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, ArrowLeft, Scissors } from "lucide-react";

type EvaMold = {
  title: string;
  icon: string;
  description: string;
  url: string;
};

const EVA_MOLDS: EvaMold[] = [
  {
    title: "Alfabeto",
    icon: "🔤",
    description: "Letras do alfabeto em EVA para decoração e painéis",
    url: "https://drive.google.com/drive/folders/1vTOg1LTEo7sECMVA6dX4NLMofyfA6ZSs",
  },
  {
    title: "Alfabeto e Números",
    icon: "🔢",
    description: "Letras e números completos para personalização",
    url: "https://drive.google.com/drive/folders/1MB-ydj4m5zr04JT2DWg4sCyL1rg2gn3Z",
  },
  {
    title: "Como Aumentar e Diminuir Moldes",
    icon: "📏",
    description: "Tutorial: redimensionar moldes de EVA do jeito certo",
    url: "https://drive.google.com/drive/folders/1QuLi90sEWqRmsmOwvHBdgaAb0_F_xYXM",
  },
  {
    title: "Moldes Anjinhos",
    icon: "👼",
    description: "Anjinhos para enfeites, batizados e decoração sacra",
    url: "https://drive.google.com/drive/folders/15inzk-qEwLABzdA3yhGCGVjEcu_BH5PM",
  },
  {
    title: "Moldes Bailarina",
    icon: "🩰",
    description: "Bailarinas para festas, painéis e decorações delicadas",
    url: "https://drive.google.com/drive/folders/1E_Cng4U6Y-nEKEMMDPfdlF4L_dL9QIyB",
  },
  {
    title: "Moldes Bíblicos",
    icon: "✝️",
    description: "Peças bíblicas para decoração religiosa e eventos",
    url: "https://drive.google.com/drive/folders/1LR7xFOw1rkOgHFEFUyyCvWQ81aLgMqlg",
  },
  {
    title: "Moldes Bita",
    icon: "🐛",
    description: "Personagens do Mundo Bita para festas infantis",
    url: "https://drive.google.com/drive/folders/1eoamm8UC-mYg_MmI-SwN__RaVWKFAr2T",
  },
  {
    title: "Moldes Cabeças",
    icon: "🗿",
    description: "Cabeças de personagens em tamanho real e gigante",
    url: "https://drive.google.com/drive/folders/12Qa5mPras-tAepAIwS0UVtIMetEdFn-7",
  },
  {
    title: "Moldes de Frutas",
    icon: "🍎",
    description: "Frutas coloridas e realistas em EVA para enfeitar",
    url: "https://drive.google.com/drive/folders/1Uhsb3wz-dEv3G01FY_chtlpnqY7dt9rb",
  },
  {
    title: "Moldes Flores e Folhas",
    icon: "🌸",
    description: "Flores e folhas para arranjos, painéis e decoração",
    url: "https://drive.google.com/drive/folders/1CTIqgTKY6pTurPkSsWYLLCs0o9CUeMLl",
  },
  {
    title: "Moldes Galinha Pintadinha",
    icon: "🐔",
    description: "Personagens da Galinha Pintadinha para festas infantis",
    url: "https://drive.google.com/drive/folders/1h-UHTs6CGzn4Wts_jJ4UE5YKoAnO1-rs",
  },
  {
    title: "Moldes Letras Grandes",
    icon: "🔡",
    description: "Letras em tamanho grande para painéis e murais",
    url: "https://drive.google.com/drive/folders/1_0htL2hNDZ4WbwbWf_nmAoOBffAx8Tpc",
  },
  {
    title: "Moldes Lilo & Stitch",
    icon: "💙",
    description: "Personagens do Lilo & Stitch para festas e decoração",
    url: "https://drive.google.com/drive/folders/1XdQw_1XIdqCqxnIHurYpngKmTfuL1N1l",
  },
  {
    title: "Moldes Nascimento de Jesus",
    icon: "⭐",
    description: "Presépio e peças natalinas para decoração religiosa",
    url: "https://drive.google.com/drive/folders/1uhHbVydZxiQleG9zgtN-lV3bKzQ99w_I",
  },
  {
    title: "Moldes P.C.D.",
    icon: "♿",
    description: "Moldes com temática inclusiva e acessibilidade",
    url: "https://drive.google.com/drive/folders/17B2n01uwvmi3LOOw5BlzCZqA0ZScccuD",
  },
  {
    title: "Moldes Páscoa",
    icon: "🐣",
    description: "Coelhos, ovos e personagens de Páscoa em EVA",
    url: "https://drive.google.com/drive/folders/1FDcA6-96k6SkpFIMV2w3EIbfE9DplVA3",
  },
  {
    title: "Moldes Safari",
    icon: "🦁",
    description: "Animais do safari: leão, girafa, elefante e mais",
    url: "https://drive.google.com/drive/folders/1q599_g6IDNgZKdYS2T4LQ5GF2S_KcuLl",
  },
  {
    title: "Moldes Ursinhos",
    icon: "🐻",
    description: "Ursinhos fofos para festas, maternidades e decoração",
    url: "https://drive.google.com/drive/folders/1tNoaDMYFba6hROeFIfl-NnQWuWYOGooM",
  },
  {
    title: "Moldes Wandinha",
    icon: "🕷️",
    description: "Personagens da Wandinha para festas e decoração gótica",
    url: "https://drive.google.com/drive/folders/1BQuohAJ13q5zgxQfTiZcMw3TGxccry5j",
  },
  {
    title: "Ponteiras de Lápis — Natal",
    icon: "🎄",
    description: "Ponteiras natalinas para lápis: Papai Noel, renas e mais",
    url: "https://drive.google.com/drive/folders/12_m_PqNTI2tyYQMhEOZycCnA8J6rPjKu",
  },
  {
    title: "Porquinho Passo a Passo",
    icon: "🐷",
    description: "Tutorial completo do porquinho em EVA do zero",
    url: "https://drive.google.com/drive/folders/1n3dxqp54pYV7cby7kgT0q6BZuj3p0NCP",
  },
  {
    title: "450 Moldes Feltro",
    icon: "🧶",
    description: "450 moldes em feltro — personagens, animais e muito mais",
    url: "https://drive.google.com/drive/folders/15AzfHSKDAr1mOapN0Tv-GrkrlhBSqh-9",
  },
];

export default function PackEvaPage() {
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

        if (!products.includes("pack-eva")) {
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
              🎨 Pack EVA Premium
            </h1>
            <p className="text-muted text-xs mt-0.5">
              {EVA_MOLDS.length} categorias de moldes
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-muted">
            Clique em uma categoria para acessar os moldes no Google Drive
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVA_MOLDS.map((mold) => (
            <a
              key={mold.title}
              href={mold.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group polaroid rounded-2xl hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 h-full flex flex-col">
                <div className="text-4xl mb-3">{mold.icon}</div>
                <h3 className="font-marker text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {mold.title}
                </h3>
                <p className="text-muted text-sm mb-4 flex-1">
                  {mold.description}
                </p>
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
        Papercraft Brasil © {new Date().getFullYear()} — Todos os direitos
        reservados
      </footer>
    </div>
  );
}

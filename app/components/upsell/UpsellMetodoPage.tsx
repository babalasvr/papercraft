"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ArrowRight, Shield, Award } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import DownsellMetodoModal from "./DownsellMetodoModal";

function UpsellMetodoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDownsell, setShowDownsell] = useState(false);

  const buildUrl = (path: string) => {
    const orderId = searchParams.get("order_id");
    return orderId ? `${path}?order_id=${orderId}` : path;
  };

  const handleAccept = () => {
    window.location.href = "https://pay.cakto.com.br/qwygrrc_808617";
  };

  const handleDecline = () => {
    setShowDownsell(true);
  };

  const includes = [
    "Como precificar suas peças (papel e EVA)",
    "Onde vender: Instagram, Shopee, feiras, encomendas",
    "Como fotografar para vender mais",
    "Os 10 personagens que mais vendem",
    "Script de atendimento para fechar encomendas",
    "Como montar sua primeira vitrine digital em 1 dia",
    "Planilha de controle de custos e lucro",
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Urgency Header */}
      <div className="bg-gradient-to-r from-[#8B2E06] to-[#C1440E] text-white py-3 px-4 text-center">
        <p className="text-sm font-bold">
          ⚠️ Oferta especial — disponível por 10 minutos
        </p>
        <div className="mt-1">
          <CountdownTimer minutes={10} redirectTo="/obrigado" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Headline */}
        <div className="text-center mb-6">
          <h1 className="font-marker text-3xl md:text-4xl text-[#3D2B1F] leading-tight mb-4">
            Você tem os moldes.
            <br />
            <span className="text-[#C1440E]">
              Agora aprenda a transformar papel e EVA em até R$5.000 por mês.
            </span>
          </h1>
          <p className="text-[#6B5B4F] text-lg">
            O método completo para vender papercrafts e peças em EVA no
            Instagram, Shopee e feiras — mesmo começando do zero.
          </p>
        </div>

        {/* Objection Break */}
        <div className="bg-[#C1440E]/10 border-2 border-[#C1440E]/20 rounded-2xl p-5 mb-6 text-center">
          <p className="text-[#3D2B1F] font-semibold">
            Não precisa de experiência. Não precisa de loja física.
            <br />
            <span className="text-[#C1440E]">
              Só precisa dos moldes que você acabou de comprar.
            </span>
          </p>
        </div>

        {/* What's included */}
        <div className="bg-white rounded-2xl border-2 border-[#E8D5C0] p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#C1440E]" />
            <h3 className="font-marker text-lg text-[#3D2B1F]">
              O que está incluído:
            </h3>
          </div>
          <ul className="space-y-3">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-[#3D2B1F] font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Anchoring */}
        <div className="bg-gradient-to-br from-[#3D2B1F] to-[#2A1F15] rounded-2xl p-6 mb-6 text-white text-center">
          <p className="text-white/80 text-sm mb-2">
            Cursos de empreendedorismo custam R$300, R$500, R$1.000.
          </p>
          <p className="text-white/80 text-sm mb-4">
            Este método sai por:
          </p>
          <div className="mb-2">
            <span className="font-marker text-5xl text-[#22C55E]">
              R$ 47,00
            </span>
          </div>
          <p className="text-white/60 text-xs">
            Menos que 1 peça vendida
          </p>
        </div>

        {/* Guarantee */}
        <div className="bg-white rounded-2xl border-2 border-[#22C55E]/30 p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-[#22C55E]" />
            <span className="font-bold text-[#3D2B1F]">
              Garantia de 7 dias
            </span>
          </div>
          <p className="text-[#6B5B4F] text-sm">
            Se não gostar, devolvemos 100% do valor.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleAccept}
          className="cta-button w-full py-4 rounded-xl font-bold text-lg text-center flex items-center justify-center gap-2 cursor-pointer text-white"
        >
          SIM! QUERO APRENDER A LUCRAR
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 mt-3 text-[#6B5B4F] text-xs">
          <Shield className="w-4 h-4" />
          <span>Compra segura • Garantia de 7 dias</span>
        </div>

        {/* Decline */}
        <button
          onClick={handleDecline}
          className="w-full text-center mt-6 text-[#6B5B4F] text-sm hover:text-[#3D2B1F] transition-colors cursor-pointer underline decoration-dashed underline-offset-4"
        >
          Não obrigado, só quero os moldes
        </button>
      </div>

      {/* Downsell Modal */}
      {showDownsell && (
        <DownsellMetodoModal onClose={() => setShowDownsell(false)} />
      )}
    </div>
  );
}

export default function UpsellMetodoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
          <div className="animate-pulse text-[#C1440E] font-marker text-xl">
            Carregando...
          </div>
        </div>
      }
    >
      <UpsellMetodoContent />
    </Suspense>
  );
}

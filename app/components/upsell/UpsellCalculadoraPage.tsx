"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ArrowRight, Shield } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import PrecificacaoCalculator from "./PrecificacaoCalculator";
import DownsellCalculadoraModal from "./DownsellCalculadoraModal";
import DownsellFinalModal from "./DownsellFinalModal";

function UpsellCalculadoraContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDownsellCalc, setShowDownsellCalc] = useState(false);
  const [showDownsellFinal, setShowDownsellFinal] = useState(false);

  const buildUrl = (path: string) => {
    const orderId = searchParams.get("order_id");
    return orderId ? `${path}?order_id=${orderId}` : path;
  };

  const handleAccept = () => {
    // TODO: Integrate with Cakto payment link for Calculadora R$27
    router.push(buildUrl("/obrigado"));
  };

  const handleDecline = () => {
    setShowDownsellCalc(true);
  };

  const handleDownsellCalcDecline = () => {
    setShowDownsellCalc(false);
    setShowDownsellFinal(true);
  };

  const features = [
    "Calcula custo de material (papel, EVA, cola, tinta)",
    "Calcula tempo de mão de obra",
    "Aplica margem de lucro automática",
    "Sugere preço final de venda",
    "Mostra preço mínimo e preço ideal",
    "Tabela de referência: o que o mercado cobra",
    "Acesso vitalício com atualizações",
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Urgency Header */}
      <div className="bg-gradient-to-r from-[#8B2E06] to-[#C1440E] text-white py-3 px-4 text-center">
        <p className="text-sm font-bold">
          ⚠️ Última oferta — disponível por 10 minutos
        </p>
        <div className="mt-1">
          <CountdownTimer minutes={10} redirectTo="/obrigado" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Headline */}
        <div className="text-center mb-6">
          <h1 className="font-marker text-3xl md:text-4xl text-[#3D2B1F] leading-tight mb-4">
            Quanto você deve cobrar pelas suas peças?
          </h1>
          <p className="text-[#6B5B4F] text-lg">
            A Calculadora de Precificação Profissional para Papercraft e EVA
          </p>
        </div>

        {/* Calculator Preview */}
        <PrecificacaoCalculator />

        {/* Features */}
        <div className="bg-white rounded-2xl border-2 border-[#E8D5C0] p-6 my-6 shadow-sm">
          <h3 className="font-marker text-lg text-[#3D2B1F] mb-4">
            O que a calculadora faz:
          </h3>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-[#3D2B1F] font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div className="bg-gradient-to-br from-[#3D2B1F] to-[#2A1F15] rounded-2xl p-6 mb-6 text-white text-center">
          <p className="text-white/60 text-xs mb-3">
            Acesso vitalício por apenas
          </p>
          <div className="mb-2">
            <span className="font-marker text-5xl text-[#22C55E]">
              R$ 27,00
            </span>
          </div>
          <p className="text-white/60 text-xs">
            Pagamento único • Atualizações incluídas
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleAccept}
          className="cta-button w-full py-4 rounded-xl font-bold text-lg text-center flex items-center justify-center gap-2 cursor-pointer text-white"
        >
          SIM! QUERO A CALCULADORA
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 mt-3 text-[#6B5B4F] text-xs">
          <Shield className="w-4 h-4" />
          <span>Compra segura • Acesso imediato</span>
        </div>

        {/* Decline */}
        <button
          onClick={handleDecline}
          className="w-full text-center mt-6 text-[#6B5B4F] text-sm hover:text-[#3D2B1F] transition-colors cursor-pointer underline decoration-dashed underline-offset-4"
        >
          Não obrigado
        </button>
      </div>

      {/* Downsell Calculadora Modal */}
      {showDownsellCalc && (
        <DownsellCalculadoraModal
          onClose={() => setShowDownsellCalc(false)}
          onDecline={handleDownsellCalcDecline}
        />
      )}

      {/* Downsell Final Modal */}
      {showDownsellFinal && (
        <DownsellFinalModal onClose={() => setShowDownsellFinal(false)} />
      )}
    </div>
  );
}

export default function UpsellCalculadoraPage() {
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
      <UpsellCalculadoraContent />
    </Suspense>
  );
}

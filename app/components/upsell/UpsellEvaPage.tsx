"use client";

import { Suspense, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ArrowRight, Shield } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import UpsellPixModal from "./UpsellPixModal";

function UpsellEvaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPixModal, setShowPixModal] = useState(false);
  const orderId = searchParams.get("order_id") || "";

  const buildUrl = (path: string) => {
    return orderId ? `${path}?order_id=${orderId}` : path;
  };

  const handleAccept = () => {
    if (orderId) {
      setShowPixModal(true);
    }
  };

  const handleDecline = () => {
    router.push(buildUrl("/upsell-metodo"));
  };

  const handlePaid = useCallback(() => {
    setShowPixModal(false);
    router.push(buildUrl("/upsell-metodo"));
  }, [router, orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const benefits = [
    "Resultado 3x mais resistente que papel",
    "Acabamento profissional",
    "Mesmo processo: corta, dobra, cola",
    "Peças que vendem por R$80–R$300 no mercado",
    "2.500 moldes incluídos",
  ];

  const characters = [
    "Dobermann",
    "Pikachu",
    "Dragão",
    "Naruto",
    "Batman",
    "Lobo",
    "Leão",
    "Cavalo",
    "Urso",
    "Raposa",
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {showPixModal && (
        <UpsellPixModal
          orderId={orderId}
          upsellProductId="pack-eva"
          productName="Pack EVA Premium"
          onClose={() => setShowPixModal(false)}
          onPaid={handlePaid}
        />
      )}
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
        <div className="text-center mb-8">
          <h1 className="font-marker text-3xl md:text-4xl text-[#3D2B1F] leading-tight mb-4">
            Você já tem os moldes de papel.
            <br />
            <span className="text-[#C1440E]">
              Agora leve também os mesmos personagens em EVA.
            </span>
          </h1>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl border-2 border-[#E8D5C0] p-6 mb-6 shadow-sm">
          <ul className="space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-[#3D2B1F] font-medium">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Characters */}
        <div className="bg-white rounded-2xl border-2 border-[#E8D5C0] p-6 mb-6 shadow-sm">
          <h3 className="font-marker text-lg text-[#3D2B1F] mb-3 text-center">
            Personagens do Pack:
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {characters.map((char) => (
              <span
                key={char}
                className="bg-[#FFF8F0] border border-[#D4A574] text-[#3D2B1F] text-sm font-medium px-3 py-1.5 rounded-full"
              >
                {char}
              </span>
            ))}
            <span className="bg-[#FFF8F0] border border-[#D4A574] text-[#6B5B4F] text-sm px-3 py-1.5 rounded-full">
              e muito mais...
            </span>
          </div>
        </div>

        {/* Price Anchoring */}
        <div className="bg-gradient-to-br from-[#3D2B1F] to-[#2A1F15] rounded-2xl p-6 mb-6 text-white text-center">
          <p className="text-white/80 text-sm mb-2">
            Uma única peça em EVA vende por R$80–R$200.
          </p>
          <p className="text-white/80 text-sm mb-4">
            O pack inteiro sai por:
          </p>
          <div className="mb-2">
            <span className="font-marker text-5xl text-[#22C55E]">
              R$ 19,90
            </span>
          </div>
          <p className="text-white/60 text-xs">Pagamento único • Acesso imediato</p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleAccept}
          className="cta-button w-full py-4 rounded-xl font-bold text-lg text-center flex items-center justify-center gap-2 cursor-pointer text-white"
        >
          SIM! QUERO O PACK EVA
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
          Não obrigado, só quero o papel
        </button>
      </div>
    </div>
  );
}

export default function UpsellEvaPage() {
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
      <UpsellEvaContent />
    </Suspense>
  );
}

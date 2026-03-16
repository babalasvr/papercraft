"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Check, ArrowRight, X } from "lucide-react";

interface DownsellCalculadoraModalProps {
  onClose: () => void;
  onDecline: () => void;
}

export default function DownsellCalculadoraModal({
  onClose,
  onDecline,
}: DownsellCalculadoraModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const buildUrl = (path: string) => {
    const orderId = searchParams.get("order_id");
    return orderId ? `${path}?order_id=${orderId}` : path;
  };

  const handleAccept = () => {
    // TODO: Integrate with Cakto payment link for Calculadora R$14,90
    router.push(buildUrl("/obrigado"));
  };

  const handleDecline = () => {
    onDecline();
  };

  const benefits = [
    "Descubra exatamente quanto cobrar",
    "Nunca mais venda abaixo do custo",
    "Tabela de preços de mercado incluída",
    "Acesso vitalício",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleDecline}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleDecline}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center mb-4">
          <p className="text-[#C1440E] font-bold text-sm mb-2">
            ⚡ ESPERA!
          </p>
          <h2 className="font-marker text-2xl text-[#3D2B1F] mb-2">
            Que tal um desconto especial?
          </h2>
        </div>

        <div className="bg-[#FFF8F0] rounded-xl p-4 mb-4 text-center">
          <p className="text-[#3D2B1F] font-semibold mb-1">
            A Calculadora de Precificação por apenas
          </p>
          <p className="font-marker text-4xl text-[#22C55E] mb-1">R$ 14,90</p>
          <p className="text-[#6B5B4F] text-sm">
            <span className="line-through">era R$27,00</span> — desconto de 44%
            só agora
          </p>
        </div>

        <ul className="space-y-2 mb-6">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2">
              <div className="flex-shrink-0 w-5 h-5 bg-[#22C55E] rounded-full flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-[#3D2B1F] text-sm font-medium">
                {benefit}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={handleAccept}
          className="cta-button w-full py-3.5 rounded-xl font-bold text-base text-center flex items-center justify-center gap-2 cursor-pointer text-white"
        >
          SIM! QUERO POR R$14,90
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Decline */}
        <button
          onClick={handleDecline}
          className="w-full text-center mt-4 text-[#6B5B4F] text-sm hover:text-[#3D2B1F] transition-colors cursor-pointer underline decoration-dashed underline-offset-4"
        >
          Não obrigado, dispensar
        </button>
      </div>
    </div>
  );
}

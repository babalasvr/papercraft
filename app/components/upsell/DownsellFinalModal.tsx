"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import UpsellPixModal from "./UpsellPixModal";

interface DownsellFinalModalProps {
  onClose: () => void;
}

export default function DownsellFinalModal({
  onClose,
}: DownsellFinalModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPixModal, setShowPixModal] = useState(false);
  const orderId = searchParams.get("order_id") || "";

  const buildUrl = (path: string) => {
    return orderId ? `${path}?order_id=${orderId}` : path;
  };

  const handleAccept = () => {
    if (orderId) setShowPixModal(true);
  };

  const handlePixPaid = useCallback(() => {
    setShowPixModal(false);
    router.push(buildUrl("/obrigado"));
  }, [router, orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDecline = () => {
    router.push(buildUrl("/obrigado"));
  };

  return (
    <>
    {showPixModal && (
      <UpsellPixModal
        orderId={orderId}
        upsellProductId="pack-animais"
        productName="Pack Animais Low Poly"
        onClose={() => setShowPixModal(false)}
        onPaid={handlePixPaid}
      />
    )}
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
            🎁 ÚLTIMA OFERTA
          </p>
          <h2 className="font-marker text-2xl text-[#3D2B1F] mb-2">
            Última oferta antes de acessar seus moldes...
          </h2>
        </div>

        <div className="bg-[#FFF8F0] rounded-xl p-5 mb-5 text-center">
          <p className="text-[#3D2B1F] font-semibold mb-2">
            Que tal o Pack Animais Low Poly?
          </p>
          <p className="text-[#6B5B4F] text-sm mb-3">
            50 moldes dos bichos mais pedidos por
          </p>
          <p className="font-marker text-4xl text-[#22C55E] mb-3">R$ 9,90</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Leão", "Lobo", "Urso", "Raposa", "Elefante"].map((animal) => (
              <span
                key={animal}
                className="bg-white border border-[#D4A574] text-[#3D2B1F] text-sm font-medium px-3 py-1 rounded-full"
              >
                {animal}
              </span>
            ))}
            <span className="text-[#6B5B4F] text-sm py-1">...</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleAccept}
          className="cta-button w-full py-3.5 rounded-xl font-bold text-base text-center flex items-center justify-center gap-2 cursor-pointer text-white"
        >
          SIM, QUERO POR R$9,90
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Decline */}
        <button
          onClick={handleDecline}
          className="w-full text-center mt-4 text-[#6B5B4F] text-sm hover:text-[#3D2B1F] transition-colors cursor-pointer underline decoration-dashed underline-offset-4"
        >
          Não, obrigado — acessar meus moldes
        </button>
      </div>
    </div>
    </>
  );
}

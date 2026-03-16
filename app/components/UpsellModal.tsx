"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface UpsellModalProps {
  onClose: () => void;
}

const UPSELL_URL = "https://pay.cakto.com.br/inwgjhy";
const INICIANTE_URL = "https://pay.cakto.com.br/fdro8ye";
const TIMER_SECONDS = 4 * 60 + 18; // 4:18

export default function UpsellModal({ onClose }: UpsellModalProps) {
  const [seconds, setSeconds] = useState(TIMER_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  function goIniciante() {
    window.open(INICIANTE_URL, "_blank", "noopener,noreferrer");
    onClose();
  }

  function goUpsell() {
    window.open(UPSELL_URL, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
    >
      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">

        {/* Header vermelho */}
        <div className="bg-red-600 text-white text-center py-3 px-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">⚠️ SUPER DESCONTO ESPECIAL</span>
          <button
            onClick={onClose}
            className="text-white hover:text-red-200 transition-colors"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-center">

          {/* Imagem / ícone */}
          <div className="relative inline-block mb-1">
            <div className="text-8xl select-none">🎁</div>
            <div
              className="absolute -bottom-1 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg"
              style={{ fontFamily: '"Permanent Marker", cursive' }}
            >
              SÓ HOJE!
            </div>
          </div>

          {/* Título */}
          <h2
            className="text-[#0F172A] text-2xl font-bold leading-snug mt-4 mb-3"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            ESPERE UM POUCO<br />
            VOCÊ ACABOU DE GANHAR<br />
            UM{" "}
            <span className="text-[#0188FA]">SUPER DESCONTO!</span>
          </h2>

          {/* Texto */}
          <p className="text-[#475569] text-sm mb-5 leading-relaxed">
            Você mostrou interesse no Papercraft, então queremos te ajudar.
            Leve o <strong>PACOTE COMPLETO (Mestre)</strong> com um preço exclusivo agora.
          </p>

          {/* Preço */}
          <div className="border-2 border-dashed border-red-300 rounded-2xl px-4 py-4 mb-4 bg-red-50">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
              OFERTA RELÂMPAGO
            </p>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-gray-400 line-through text-base font-semibold">R$24,90</span>
              <span
                className="text-green-600 text-4xl font-bold"
                style={{ fontFamily: '"Permanent Marker", cursive' }}
              >
                R$ 17,90
              </span>
            </div>
            {/* Countdown */}
            {seconds > 0 ? (
              <div className="flex items-center justify-center gap-1 text-red-600 text-sm font-semibold">
                <span>⏱</span>
                <span>EXPIRA EM: {mm}:{ss}</span>
              </div>
            ) : (
              <div className="text-gray-400 text-sm font-semibold">Oferta expirada</div>
            )}
          </div>

          {/* CTA principal */}
          <button
            onClick={goUpsell}
            className="btn-initcheck w-full text-white text-lg font-bold py-4 rounded-2xl mb-3 transition-transform active:scale-95 cursor-pointer"
            style={{
              fontFamily: '"Permanent Marker", cursive',
              backgroundColor: "#22C55E",
              boxShadow: "0 5px 0 0 #16A34A",
            }}
          >
            QUERO APROVEITAR AGORA →
          </button>

          {/* Recusar */}
          <button
            onClick={goIniciante}
            className="btn-initcheck text-gray-400 text-xs underline hover:text-gray-600 transition-colors cursor-pointer bg-transparent border-none"
          >
            Não, obrigado. Quero só o básico por R$10,00
          </button>
        </div>
      </div>
    </div>
  );
}

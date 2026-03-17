"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { X } from "lucide-react";

const CHECKOUT_URL = "/checkout?product=kit-mestre-desconto";
const TIMER_SECONDS = 4 * 60 + 18; // 4:18
// Tempo mínimo na página antes de permitir disparo (ms)
const MIN_TIME_MS = 8000;

export default function BackRedirect() {
  const [show, setShow] = useState(false);
  const [seconds, setSeconds] = useState(TIMER_SECONDS);
  const [triggered, setTriggered] = useState(false);
  // Controla se já passou tempo mínimo na página
  const readyRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => { readyRef.current = true; }, MIN_TIME_MS);
    return () => clearTimeout(t);
  }, []);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (triggered || !readyRef.current) return;
      // Only trigger when mouse leaves from the top of the viewport
      if (e.clientY <= 0) {
        setShow(true);
        setTriggered(true);
      }
    },
    [triggered]
  );

  useEffect(() => {
    document.addEventListener("mouseout", handleMouseLeave);
    return () => document.removeEventListener("mouseout", handleMouseLeave);
  }, [handleMouseLeave]);

  // Handle back button via popstate (mobile)
  useEffect(() => {
    if (triggered) return;

    // Push a dummy state so pressing back triggers popstate instead of navigating away
    window.history.pushState({ backRedirect: true }, "");

    const handlePopState = () => {
      // Só dispara se o usuário já ficou o tempo mínimo na página
      if (!triggered && readyRef.current) {
        setShow(true);
        setTriggered(true);
        // Push again to prevent actual navigation
        window.history.pushState({ backRedirect: true }, "");
      } else if (!readyRef.current) {
        // Usuário saiu rápido demais — não mostrar modal, mas re-push para não navegar
        window.history.pushState({ backRedirect: true }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [triggered]);

  // Countdown
  useEffect(() => {
    if (!show || seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [show, seconds]);

  if (!show) return null;

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  function goCheckout() {
    window.location.href = CHECKOUT_URL;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.80)" }}
    >
      <div className="relative bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-[scaleIn_0.3s_ease-out]">
        {/* Header */}
        <div className="bg-red-600 text-white text-center py-3 px-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">
            ⚠️ ESPERE! OFERTA EXCLUSIVA
          </span>
          <button
            onClick={() => setShow(false)}
            className="text-white hover:text-red-200 transition-colors"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-center">
          <div className="relative inline-block mb-1">
            <div className="text-8xl select-none">🚨</div>
            <div
              className="absolute -bottom-1 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg"
              style={{ fontFamily: '"Permanent Marker", cursive' }}
            >
              ÚLTIMA CHANCE!
            </div>
          </div>

          <h2
            className="text-[#3D2B1F] text-2xl font-bold leading-snug mt-4 mb-3"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            ESPERE!<br />
            NÃO VÁ EMBORA<br />
            SEM ESSE{" "}
            <span className="text-[#C1440E]">DESCONTO ESPECIAL!</span>
          </h2>

          <p className="text-[#6B5B4F] text-sm mb-5 leading-relaxed">
            Antes de sair, queremos te dar uma <strong>última oportunidade</strong>.
            Leve o <strong>PACOTE COMPLETO (Mestre)</strong> por um preço
            que você <strong>não vai encontrar em outro lugar</strong>.
          </p>

          {/* Preço */}
          <div className="border-2 border-dashed border-red-300 rounded-2xl px-4 py-4 mb-4 bg-red-50">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
              OFERTA DE SAÍDA
            </p>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-gray-400 line-through text-base font-semibold">R$24,90</span>
              <span
                className="text-[#2D6A4F] text-4xl font-bold"
                style={{ fontFamily: '"Permanent Marker", cursive' }}
              >
                R$ 17,90
              </span>
            </div>
            {seconds > 0 ? (
              <div className="flex items-center justify-center gap-1 text-red-600 text-sm font-semibold">
                <span>⏱</span>
                <span>EXPIRA EM: {mm}:{ss}</span>
              </div>
            ) : (
              <div className="text-gray-400 text-sm font-semibold">Oferta expirada</div>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={goCheckout}
            className="btn-initcheck w-full text-white text-lg font-bold py-4 rounded-2xl mb-3 transition-transform active:scale-95 cursor-pointer"
            style={{
              fontFamily: '"Permanent Marker", cursive',
              backgroundColor: "#2D6A4F",
              boxShadow: "0 5px 0 0 #1B4332",
            }}
          >
            QUERO POR R$17,90 AGORA →
          </button>

          <button
            onClick={() => setShow(false)}
            className="text-gray-400 text-xs underline hover:text-gray-600 transition-colors cursor-pointer bg-transparent border-none"
          >
            Não, obrigado. Quero sair mesmo.
          </button>
        </div>
      </div>
    </div>
  );
}

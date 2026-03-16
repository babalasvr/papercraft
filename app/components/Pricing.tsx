"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import UpsellModal from "./UpsellModal";

const inicianteItems = [
  "Acesso a 1200 Moldes",
  "Acesso Vitalício",
  "Personagens",
  "Plantas",
  "Objetos",
  "Diversos",
];

const mestreItems = [
  "Acesso a +3500 Moldes",
  "Acesso Vitalício",
  "Personagens",
  "Plantas",
  "Objetos",
  "Diversos",
  "Moldes Gigantes (3D)",
  "Alfabeto Lowpoly",
  "Castelos",
  "Coisas Fofas",
  "Dinossauros",
  "Dragões",
  "Espaço – Universo",
  "Esportes",
  "Geek",
  "Mitologia",
  "Músicos",
];

const mestreBonus = [
  "Zoológico de Papercraft",
  "Heróis",
  "Animes e Mangás",
  "Garagem de Carros",
  "Área de Membros Premium",
  "Suporte Prioritário",
  "Galeria da Comunidade",
];

export default function Pricing() {
  const [showUpsell, setShowUpsell] = useState(false);

  return (
    <>
    {showUpsell && <UpsellModal onClose={() => setShowUpsell(false)} />}
    <section className="py-20 px-4 bg-white" id="pricing">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#0188FA] font-semibold uppercase tracking-widest text-sm mb-2">
            Comece agora
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#0F172A]"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            Escolha seu kit e comece hoje
          </h2>
          <p className="text-[#475569] mt-3 text-lg max-w-xl mx-auto">
            Acesso imediato — comece a criar em menos de 5 minutos
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6">
          {/* Kit Iniciante - visual POSITIVO */}
          <div className="w-full max-w-sm bg-white rounded-3xl p-8 flex flex-col border-2 border-gray-200">
            <div className="text-center mb-6">
              <p
                className="text-[#0F172A] text-2xl font-bold mb-3"
                style={{ fontFamily: '"Permanent Marker", cursive' }}
              >
                KIT INICIANTE
              </p>
              <p className="text-gray-400 text-sm line-through mb-1">
                De: R$78,90
              </p>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-[#0F172A] text-lg font-bold">R$</span>
                <span
                  className="text-5xl font-bold text-[#0F172A]"
                  style={{ fontFamily: '"Permanent Marker", cursive' }}
                >
                  10,00
                </span>
              </div>
              <p className="text-[#475569] text-sm">Perfeito pra quem está começando</p>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              {inicianteItems.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[#0F172A]">
                  <Check size={16} className="text-[#22C55E] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowUpsell(true)}
              className="block w-full text-center bg-[#0F172A] text-white font-bold py-4 rounded-2xl border-2 border-[#0F172A] hover:bg-gray-800 transition-all duration-100 cursor-pointer uppercase tracking-wide"
              style={{ fontFamily: '"Permanent Marker", cursive' }}
            >
              COMEÇAR COM O INICIANTE
            </button>
            <p className="text-center text-xs text-green-600 font-semibold mt-3">
              ✅ Garantia de 7 dias
            </p>
          </div>

          {/* Kit Mestre */}
          <div className="w-full max-w-sm rounded-3xl p-8 bg-white border-4 border-[#0188FA] relative flex flex-col">
            {/* "Mais escolhido" badge */}
            <div
              className="absolute -top-4 -right-4 bg-[#FDC700] text-black font-bold px-4 py-2 rounded-2xl text-xs shadow-lg rotate-6"
              style={{ fontFamily: '"Permanent Marker", cursive' }}
            >
              Mais escolhido!
            </div>

            <div className="text-center mb-6 pt-2">
              <p
                className="text-[#0188FA] text-2xl font-bold mb-3"
                style={{ fontFamily: '"Permanent Marker", cursive' }}
              >
                KIT MESTRE
              </p>
              <p className="text-gray-400 text-sm line-through mb-1">
                De: R$149,80
              </p>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-[#0188FA] text-2xl font-bold">R$</span>
                <span
                  className="text-6xl font-bold text-[#0F172A]"
                  style={{ fontFamily: '"Permanent Marker", cursive' }}
                >
                  24,90
                </span>
              </div>
              <div className="inline-block bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                Economize R$125,00
              </div>
            </div>

            <ul className="space-y-2 mb-4">
              {mestreItems.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[#0F172A] font-medium">
                  <Check size={16} className="text-[#22C55E] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Bonus box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="text-center mb-3">
                <span className="bg-[#FDC700] text-black text-xs font-bold px-3 py-1 rounded-full">
                  + 7 BÔNUS GRÁTIS (R$130)
                </span>
              </div>
              <ul className="space-y-2">
                {mestreBonus.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#0F172A] font-medium">
                    <span>🎁</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Main CTA */}
            <a
              href="https://pay.cakto.com.br/4ptqmkr_807214"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-initcheck cta-button block w-full text-center text-white text-lg font-bold py-5 rounded-2xl cursor-pointer no-underline uppercase tracking-wide"
              style={{ fontFamily: '"Permanent Marker", cursive' }}
            >
              QUERO O KIT COMPLETO
            </a>

            <p className="text-center text-xs text-green-600 font-semibold mt-3">
              ✅ Garantia de 7 dias — risco zero
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

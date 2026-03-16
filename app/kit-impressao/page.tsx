"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, Printer, Scissors, Star, ArrowRight, Shield } from "lucide-react";

const CHECKOUT_URL = "https://pay.cakto.com.br/4ptqmkr_807214";

const whatYouGet = [
  {
    icon: "🖨️",
    title: "Configurações Exatas de Impressora",
    desc: "DPI, qualidade, escala e modo de cor ideais para papercraft. Chega de imprimir e sair torto ou pixelado.",
  },
  {
    icon: "📄",
    title: "Guia de Papéis e Gramaturas",
    desc: "Qual papel usar para cada tipo de molde: personagens pequenos, peças grandes, detalhes finos — sem desperdício.",
  },
  {
    icon: "✂️",
    title: "Técnicas de Corte Profissional",
    desc: "Como usar estilete, tesoura e régua para cortes limpos e sem amassar. O segredo dos modelos perfeitos.",
  },
  {
    icon: "📐",
    title: "Dobras e Vincos sem Rasgar",
    desc: "Método de vinco com régua e osso de dobrar (ou substituto caseiro) que deixa as dobras nítidas.",
  },
  {
    icon: "🔧",
    title: "Cola Certa para Cada Situação",
    desc: "Qual cola usar, quanto aplicar e como segurar sem escorregar. Fim das peças que abrem depois de prontas.",
  },
  {
    icon: "💡",
    title: "5 Erros Fatais do Iniciante",
    desc: "Os erros que fazem 90% das pessoas desistirem — e como evitar cada um deles antes de começar.",
  },
];

const painPoints = [
  "Papel que amassa na hora de dobrar",
  "Impressão saindo torta ou com cores erradas",
  "Cortes irregulares que estragam o modelo",
  "Cola que faz a peça abrir depois de pronta",
  "Desperdiçou folhas e ainda ficou feio",
];

export default function KitImpressaoPage() {
  const [minutes, setMinutes] = useState(14);
  const [seconds, setSeconds] = useState(59);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s === 0) {
          setMinutes((m) => {
            if (m === 0) {
              clearInterval(timer);
              return 0;
            }
            return m - 1;
          });
          return 59;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#FDFDFD]">

      {/* TOP URGENCY BAR */}
      <div className="bg-[#0F172A] text-white text-center py-3 px-4">
        <p className="text-sm font-bold tracking-wide">
          ⚡ OFERTA EXCLUSIVA PÓS-COMPRA — Esta página desaparece em{" "}
          <span className="font-mono bg-red-500 px-2 py-0.5 rounded text-white">
            {pad(minutes)}:{pad(seconds)}
          </span>
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* HERO */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-4 py-1.5 rounded-full text-xs font-bold mb-6">
            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
            ADICIONE À SUA COMPRA — APENAS HOJE
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight mb-4 uppercase"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            Seus Moldes Ficam{" "}
            <span style={{ color: "#0188FA" }}>Perfeitos</span>
            <br />na Primeira Tentativa
          </h1>

          <p className="text-[#475569] text-lg leading-relaxed max-w-lg mx-auto">
            O <strong className="text-[#0F172A]">Kit Impressão Profissional</strong> revela as
            configurações e técnicas exatas que os papercrafters experientes usam
            — e nunca contam de graça.
          </p>
        </div>

        {/* PAIN SECTION */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="font-bold text-red-700 text-sm">
              Você vai imprimir hoje. Sem esse guia, é provável que:
            </p>
          </div>
          <ul className="space-y-2">
            {painPoints.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-red-700">
                <span className="flex-shrink-0 mt-0.5">❌</span>
                {p}
              </li>
            ))}
          </ul>
          <p className="text-xs text-red-500 mt-4 text-center font-semibold">
            São erros simples de evitar — se souber o que fazer.
          </p>
        </div>

        {/* WHAT YOU GET */}
        <div className="mb-8">
          <h2
            className="text-2xl font-bold text-[#0F172A] text-center mb-6"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            O que está no Kit:
          </h2>
          <div className="space-y-3">
            {whatYouGet.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 bg-white border-2 border-gray-100 rounded-xl p-4 shadow-sm"
              >
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <p className="font-bold text-[#0F172A] text-sm mb-1">{item.title}</p>
                  <p className="text-[#475569] text-sm leading-relaxed">{item.desc}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>

        {/* SOCIAL PROOF */}
        <div className="grid grid-cols-3 gap-3 mb-8 text-center">
          {[
            { n: "+3.000", label: "papercrafters ativos" },
            { n: "97%", label: "aprovação nos reviews" },
            { n: "0", label: "reembolsos no Kit Impressão" },
          ].map((s) => (
            <div key={s.label} className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p
                className="text-2xl font-bold text-[#0188FA]"
                style={{ fontFamily: '"Permanent Marker", cursive' }}
              >
                {s.n}
              </p>
              <p className="text-xs text-[#475569] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* PRICING BOX */}
        <div className="polaroid rounded-2xl mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 text-center">
            <p className="text-sm font-bold text-[#475569] uppercase tracking-widest mb-2">
              Adicione agora por
            </p>

            {/* Price */}
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="text-lg text-gray-400 line-through">R$ 37</span>
              <span
                className="text-5xl font-bold text-[#0F172A]"
                style={{ fontFamily: '"Permanent Marker", cursive' }}
              >
                R$ 17
              </span>
            </div>
            <p className="text-xs text-green-600 font-bold mb-6">
              ✅ Economia de R$ 20 — só nesta página
            </p>

            {/* What's included recap */}
            <div className="flex flex-col items-start gap-2 text-sm text-left mb-6 max-w-xs mx-auto">
              {[
                "Guia de configurações de impressora",
                "Tabela de gramaturas por tipo de molde",
                "Técnicas de corte e dobra profissional",
                "Checklist anti-erro para iniciantes",
                "Acesso imediato via PDF",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2 text-[#475569]">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>

            {/* CTA */}
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button w-full py-5 rounded-xl font-bold text-xl text-center flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" />
              SIM! Quero Imprimir Perfeito — R$ 17
              <ArrowRight className="w-5 h-5" />
            </a>

            <p className="text-xs text-[#475569] mt-4 flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Compra segura · Acesso imediato · Garantia de 7 dias
            </p>
          </div>
        </div>

        {/* GUARANTEE */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 flex items-start gap-4 mb-8">
          <Shield className="w-10 h-10 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-green-800 mb-1">Garantia de 7 dias sem perguntas</p>
            <p className="text-sm text-green-700">
              Se você aplicar as técnicas do kit e não ficar satisfeito com o resultado,
              devolvemos 100% do seu dinheiro. Simples assim.
            </p>
          </div>
        </div>

        {/* DECLINE LINK */}
        <div className="text-center pb-8">
          <a
            href="/obrigado"
            className="text-xs text-gray-400 hover:text-gray-500 underline"
          >
            Não, obrigado — prefiro continuar imprimindo no modo tentativa e erro
          </a>
        </div>

      </div>
    </div>
  );
}

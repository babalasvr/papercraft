"use client";

import { Clock, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export default function BannerTopo() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setDate(
        now.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full py-2 px-4 text-white"
      style={{
        background: "linear-gradient(90deg, #8B2E06 0%, #C1440E 50%, #8B2E06 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2">
        {/* Conteúdo central */}
        <div className="flex-1 flex items-center justify-center gap-2 flex-wrap text-sm font-medium min-w-0">
          <span className="relative inline-flex shrink-0">
            <Clock size={16} className="relative z-10" />
            <span
              className="absolute inset-0 rounded-full bg-white opacity-40 animate-pulse-ring"
              style={{ transform: "scale(1.5)" }}
            />
          </span>
          <span
            className="font-marker text-center leading-tight"
            style={{ fontFamily: '"Permanent Marker", cursive', fontSize: "clamp(11px, 3.5vw, 14px)" }}
          >
            +3500 MOLDES POR APENAS R$24,90
          </span>
          <span className="hidden sm:inline opacity-60">•</span>
          <span className="hidden sm:inline text-xs opacity-80">
            {date && `Hoje, ${date}`} &nbsp;|&nbsp; {time}
          </span>
          <span className="hidden sm:inline opacity-60">•</span>
          <span className="bg-[#D4A574] text-[#3D2B1F] text-xs font-bold px-2 py-0.5 rounded-full hidden sm:inline">
            ACESSO IMEDIATO
          </span>
        </div>

        {/* Botão "Já sou aluno" — só ícone no mobile, texto completo no sm+ */}
        <a
          href="/membros"
          className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors text-white text-xs font-semibold px-2.5 py-1.5 rounded-full border border-white/30 shrink-0"
        >
          <LogIn size={13} />
          <span className="hidden sm:inline whitespace-nowrap">Já sou aluno</span>
        </a>
      </div>
    </div>
  );
}

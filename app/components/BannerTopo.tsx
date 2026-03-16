"use client";

import { Clock } from "lucide-react";
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
      className="w-full py-2.5 px-4 text-white text-center text-sm font-medium"
      style={{
        background: "linear-gradient(90deg, #005BB5 0%, #0188FA 50%, #005BB5 100%)",
      }}
    >
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="relative inline-flex">
          <Clock size={16} className="relative z-10" />
          <span
            className="absolute inset-0 rounded-full bg-white opacity-40 animate-pulse-ring"
            style={{ transform: "scale(1.5)" }}
          />
        </span>
        <span className="font-marker" style={{ fontFamily: '"Permanent Marker", cursive' }}>
          +3500 MOLDES POR APENAS R$24,90
        </span>
        <span className="hidden sm:inline">•</span>
        <span>
          {date && `Hoje, ${date}`} &nbsp;|&nbsp; {time}
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
          ACESSO IMEDIATO
        </span>
      </div>
    </div>
  );
}

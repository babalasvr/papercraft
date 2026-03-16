"use client";

import { useState, useMemo } from "react";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";

type MaterialType = "papel" | "eva" | "papel_eva";
type SizeType = "pequeno" | "medio" | "grande" | "gigante";

const SIZE_LABELS: Record<SizeType, string> = {
  pequeno: "Pequeno",
  medio: "Médio",
  grande: "Grande",
  gigante: "Gigante",
};

const MATERIAL_LABELS: Record<MaterialType, string> = {
  papel: "Papel",
  eva: "EVA",
  papel_eva: "Papel + EVA",
};

const MARKET_REFERENCE = [
  { piece: "Personagem EVA", size: "Pequeno", range: "R$35–R$60" },
  { piece: "Personagem EVA", size: "Médio", range: "R$80–R$150" },
  { piece: "Personagem EVA", size: "Grande", range: "R$150–R$300" },
  { piece: "Papercraft", size: "Pequeno", range: "R$15–R$30" },
  { piece: "Papercraft", size: "Médio", range: "R$40–R$80" },
  { piece: "Papercraft", size: "Grande", range: "R$80–R$160" },
  { piece: "Cabeça gigante", size: "Grande", range: "R$200–R$500" },
];

export default function PrecificacaoCalculator() {
  const [material, setMaterial] = useState<MaterialType>("papel");
  const [size, setSize] = useState<SizeType>("medio");
  const [materialCost, setMaterialCost] = useState(5);
  const [productionTime, setProductionTime] = useState(2);
  const [hourlyRate, setHourlyRate] = useState(15);
  const [profitMargin, setProfitMargin] = useState(100);
  const [platformFee, setPlatformFee] = useState(0);

  const results = useMemo(() => {
    const laborCost = productionTime * hourlyRate;
    const totalCost = materialCost + laborCost;
    const suggestedPrice = totalCost * (1 + profitMargin / 100);
    const feeAmount = suggestedPrice * (platformFee / 100);
    const finalPrice = suggestedPrice + feeAmount;
    const premiumPrice = finalPrice * 1.3;
    const minPrice = totalCost + feeAmount / (1 - platformFee / 100 || 1);
    const profitPerPiece = finalPrice - totalCost - feeAmount;

    const piecesFor1k = profitPerPiece > 0 ? Math.ceil(1000 / profitPerPiece) : 0;
    const piecesFor5k = profitPerPiece > 0 ? Math.ceil(5000 / profitPerPiece) : 0;

    return {
      totalCost,
      minPrice: Math.max(minPrice, totalCost),
      suggestedPrice: finalPrice,
      premiumPrice,
      profitPerPiece: Math.max(profitPerPiece, 0),
      piecesFor1k,
      piecesFor5k,
    };
  }, [materialCost, productionTime, hourlyRate, profitMargin, platformFee]);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="space-y-6">
      {/* Calculator Form */}
      <div className="bg-white rounded-2xl border-2 border-[#E8D5C0] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Calculator className="w-5 h-5 text-[#C1440E]" />
          <h3 className="font-marker text-lg text-[#3D2B1F]">
            Calculadora de Precificação
          </h3>
        </div>

        <div className="space-y-4">
          {/* Material Type */}
          <div>
            <label className="block text-sm font-semibold text-[#3D2B1F] mb-2">
              Tipo de material
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(MATERIAL_LABELS) as [MaterialType, string][]).map(
                ([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setMaterial(key)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      material === key
                        ? "bg-[#C1440E] text-white"
                        : "bg-[#FFF8F0] text-[#3D2B1F] border border-[#E8D5C0] hover:border-[#C1440E]"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-semibold text-[#3D2B1F] mb-2">
              Tamanho da peça
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(SIZE_LABELS) as [SizeType, string][]).map(
                ([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSize(key)}
                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      size === key
                        ? "bg-[#C1440E] text-white"
                        : "bg-[#FFF8F0] text-[#3D2B1F] border border-[#E8D5C0] hover:border-[#C1440E]"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Material Cost */}
          <div>
            <label className="block text-sm font-semibold text-[#3D2B1F] mb-2">
              Custo do material (R$)
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={materialCost}
              onChange={(e) => setMaterialCost(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 border-2 border-[#E8D5C0] rounded-lg focus:border-[#C1440E] focus:outline-none bg-white text-[#3D2B1F]"
            />
          </div>

          {/* Production Time */}
          <div>
            <label className="block text-sm font-semibold text-[#3D2B1F] mb-2">
              Tempo de produção (horas)
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={productionTime}
              onChange={(e) => setProductionTime(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 border-2 border-[#E8D5C0] rounded-lg focus:border-[#C1440E] focus:outline-none bg-white text-[#3D2B1F]"
            />
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-semibold text-[#3D2B1F] mb-2">
              Valor da sua hora (R$)
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 border-2 border-[#E8D5C0] rounded-lg focus:border-[#C1440E] focus:outline-none bg-white text-[#3D2B1F]"
            />
          </div>

          {/* Profit Margin Slider */}
          <div>
            <label className="block text-sm font-semibold text-[#3D2B1F] mb-2">
              Margem de lucro desejada:{" "}
              <span className="text-[#22C55E] font-marker text-lg">
                {profitMargin}%
              </span>
            </label>
            <input
              type="range"
              min={10}
              max={200}
              step={5}
              value={profitMargin}
              onChange={(e) => setProfitMargin(Number(e.target.value))}
              className="w-full h-2 bg-[#E8D5C0] rounded-lg appearance-none cursor-pointer accent-[#22C55E]"
            />
            <div className="flex justify-between text-xs text-[#6B5B4F] mt-1">
              <span>10%</span>
              <span>200%</span>
            </div>
          </div>

          {/* Platform Fee */}
          <div>
            <label className="block text-sm font-semibold text-[#3D2B1F] mb-2">
              Taxa da plataforma (%)
              <span className="font-normal text-[#6B5B4F]">
                {" "}
                — ex: Shopee 16%
              </span>
            </label>
            <input
              type="number"
              min={0}
              max={50}
              step={1}
              value={platformFee}
              onChange={(e) => setPlatformFee(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 border-2 border-[#E8D5C0] rounded-lg focus:border-[#C1440E] focus:outline-none bg-white text-[#3D2B1F]"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-[#3D2B1F] to-[#2A1F15] rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#22C55E]" />
          <h3 className="font-marker text-lg">Resultados</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white/60 text-xs mb-1">Custo total</p>
            <p className="font-bold text-base">
              {formatCurrency(results.totalCost)}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white/60 text-xs mb-1">Preço mínimo</p>
            <p className="font-bold text-base text-yellow-300">
              {formatCurrency(results.minPrice)}
            </p>
          </div>
          <div className="bg-[#22C55E]/20 rounded-xl p-3 border border-[#22C55E]/30">
            <p className="text-[#22C55E]/80 text-xs mb-1">Preço sugerido</p>
            <p className="font-bold text-lg text-[#22C55E]">
              {formatCurrency(results.suggestedPrice)}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white/60 text-xs mb-1">Preço premium</p>
            <p className="font-bold text-base text-[#D4A574]">
              {formatCurrency(results.premiumPrice)}
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              Lucro por peça
            </span>
            <span className="font-bold text-[#22C55E]">
              {formatCurrency(results.profitPerPiece)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Peças/mês p/ R$1.000</span>
            <span className="font-bold">
              {results.piecesFor1k > 0 ? `${results.piecesFor1k} peças` : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Peças/mês p/ R$5.000</span>
            <span className="font-bold">
              {results.piecesFor5k > 0 ? `${results.piecesFor5k} peças` : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Market Reference Table */}
      <div className="bg-white rounded-2xl border-2 border-[#E8D5C0] p-5 shadow-sm">
        <h3 className="font-marker text-lg text-[#3D2B1F] mb-3">
          📊 Tabela de Referência do Mercado
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[#E8D5C0]">
                <th className="text-left py-2 text-[#6B5B4F] font-semibold">
                  Peça
                </th>
                <th className="text-left py-2 text-[#6B5B4F] font-semibold">
                  Tamanho
                </th>
                <th className="text-right py-2 text-[#6B5B4F] font-semibold">
                  Mercado paga
                </th>
              </tr>
            </thead>
            <tbody>
              {MARKET_REFERENCE.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[#E8D5C0]/50 last:border-0"
                >
                  <td className="py-2 text-[#3D2B1F] font-medium">
                    {row.piece}
                  </td>
                  <td className="py-2 text-[#6B5B4F]">{row.size}</td>
                  <td className="py-2 text-right font-semibold text-[#22C55E]">
                    {row.range}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

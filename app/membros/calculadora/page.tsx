"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Scissors, Plus, Trash2, Calculator } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = "produto" | "materiais" | "tempo" | "despesas" | "margem";

type Material = {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
};

type NivelExperiencia = "iniciante" | "intermediaria" | "avancada";
type TipoMaterial = "papel" | "eva" | "ambos";
type Tamanho = "pequeno" | "medio" | "grande" | "gigante";

// ── Tabela de referência do mercado ──────────────────────────────────────────

const TABELA_MERCADO = [
  { peca: "Personagem EVA", tamanho: "Pequeno", faixa: "R$35 – R$60" },
  { peca: "Personagem EVA", tamanho: "Médio", faixa: "R$80 – R$150" },
  { peca: "Personagem EVA", tamanho: "Grande", faixa: "R$150 – R$300" },
  { peca: "Papercraft", tamanho: "Pequeno", faixa: "R$15 – R$30" },
  { peca: "Papercraft", tamanho: "Médio", faixa: "R$40 – R$80" },
  { peca: "Papercraft", tamanho: "Grande", faixa: "R$80 – R$160" },
  { peca: "Cabeça Gigante", tamanho: "Gigante", faixa: "R$200 – R$500" },
];

// ── Formatação ───────────────────────────────────────────────────────────────

function fmt(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function CalculadoraPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Auth check
  useEffect(() => {
    async function checkAccess() {
      const saved = localStorage.getItem("papercraft_member");
      if (!saved) { router.replace("/membros"); return; }
      try {
        const { email } = JSON.parse(saved);
        if (!email) { router.replace("/membros"); return; }
        const res = await fetch(`/api/member-products?email=${encodeURIComponent(email)}`);
        if (!res.ok) { router.replace("/membros"); return; }
        const data = await res.json();
        if (!(data.products || []).includes("calculadora-precificacao")) {
          router.replace("/membros"); return;
        }
        setAuthorized(true);
      } catch { router.replace("/membros"); }
      finally { setLoading(false); }
    }
    checkAccess();
  }, [router]);

  // ── State ──────────────────────────────────────────────────────────────────

  const [activeTab, setActiveTab] = useState<Tab>("produto");

  // Produto
  const [nomePeca, setNomePeca] = useState("");
  const [tipoMaterial, setTipoMaterial] = useState<TipoMaterial>("papel");
  const [tamanho, setTamanho] = useState<Tamanho>("medio");

  // Materiais
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [matNome, setMatNome] = useState("");
  const [matQtd, setMatQtd] = useState("");
  const [matUnidade, setMatUnidade] = useState("unidades");
  const [matPreco, setMatPreco] = useState("");

  // Tempo
  const [horas, setHoras] = useState("");
  const [minutos, setMinutos] = useState("");
  const [nivelExp, setNivelExp] = useState<NivelExperiencia>("iniciante");

  // Despesas
  const [embalagem, setEmbalagem] = useState("");
  const [transporte, setTransporte] = useState("");
  const [taxaPlataforma, setTaxaPlataforma] = useState("");
  const [outrosCustos, setOutrosCustos] = useState("");

  // Margem
  const [margem, setMargem] = useState("50");

  // ── Cálculos ───────────────────────────────────────────────────────────────

  const valorHora: Record<NivelExperiencia, number> = {
    iniciante: 8,
    intermediaria: 12,
    avancada: 18,
  };

  const custoMateriais = materiais.reduce(
    (acc, m) => acc + m.quantidade * m.precoUnitario,
    0
  );

  const tempoTotal = (parseFloat(horas) || 0) + (parseFloat(minutos) || 0) / 60;
  const custoMaoObra = tempoTotal * valorHora[nivelExp];

  const subtotal = custoMateriais + custoMaoObra;
  const taxaPlataformaNum = parseFloat(taxaPlataforma) || 0;
  const taxaPlataformaValor = subtotal * (taxaPlataformaNum / 100);
  const totalDespesas =
    (parseFloat(embalagem) || 0) +
    (parseFloat(transporte) || 0) +
    taxaPlataformaValor +
    (parseFloat(outrosCustos) || 0);

  const custoTotal = subtotal + totalDespesas;
  const margemNum = parseFloat(margem) || 0;
  const precoMinimo = custoTotal;
  const precoSugerido = custoTotal * (1 + margemNum / 100);
  const precoPremium = precoSugerido * 1.3;
  const lucroPorPeca = precoSugerido - custoTotal;
  const pecasParaMil = lucroPorPeca > 0 ? Math.ceil(1000 / lucroPorPeca) : 0;
  const pecasParaCincoMil = lucroPorPeca > 0 ? Math.ceil(5000 / lucroPorPeca) : 0;

  // ── Ações ──────────────────────────────────────────────────────────────────

  const adicionarMaterial = useCallback(() => {
    if (!matNome || !matQtd || !matPreco) return;
    setMateriais((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        nome: matNome,
        quantidade: parseFloat(matQtd) || 0,
        unidade: matUnidade,
        precoUnitario: parseFloat(matPreco) || 0,
      },
    ]);
    setMatNome("");
    setMatQtd("");
    setMatPreco("");
  }, [matNome, matQtd, matPreco, matUnidade]);

  const removerMaterial = (id: string) =>
    setMateriais((prev) => prev.filter((m) => m.id !== id));

  // ── Loading / Auth ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen grid-paper-bg flex items-center justify-center">
        <div className="animate-bounce-slow">
          <Scissors className="w-10 h-10 text-primary" />
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  // ── Tabs config ────────────────────────────────────────────────────────────

  const tabs: { id: Tab; label: string }[] = [
    { id: "produto", label: "Produto" },
    { id: "materiais", label: "Materiais" },
    { id: "tempo", label: "Tempo" },
    { id: "despesas", label: "Despesas" },
    { id: "margem", label: "Margem" },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen grid-paper-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push("/membros")}
            className="flex items-center gap-2 text-muted hover:text-primary transition-colors text-sm font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div>
            <h1 className="font-marker text-2xl text-foreground flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Calculadora de Precificação
            </h1>
            <p className="text-muted text-xs mt-0.5">Papercraft & EVA</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Painel esquerdo ── */}
          <div className="flex-1 min-w-0">

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[80px] px-3 py-3 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-primary text-white border-b-2 border-primary"
                        : "text-muted hover:text-foreground hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

              {/* ── ABA: PRODUTO ── */}
              {activeTab === "produto" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Nome da Peça
                    </label>
                    <input
                      type="text"
                      value={nomePeca}
                      onChange={(e) => setNomePeca(e.target.value)}
                      placeholder="Ex: Pikachu Papercraft Médio"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Tipo de Material
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["papel", "eva", "ambos"] as TipoMaterial[]).map((tipo) => (
                        <button
                          key={tipo}
                          onClick={() => setTipoMaterial(tipo)}
                          className={`py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                            tipoMaterial === tipo
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-gray-200 text-muted hover:border-gray-300"
                          }`}
                        >
                          {tipo === "papel" ? "📄 Papel" : tipo === "eva" ? "🎨 EVA" : "✨ Papel + EVA"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Tamanho da Peça
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(["pequeno", "medio", "grande", "gigante"] as Tamanho[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTamanho(t)}
                          className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                            tamanho === t
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-gray-200 text-muted hover:border-gray-300"
                          }`}
                        >
                          {t === "pequeno" ? "🤏 Pequeno" : t === "medio" ? "✋ Médio" : t === "grande" ? "🙌 Grande" : "🦕 Gigante"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── ABA: MATERIAIS ── */}
              {activeTab === "materiais" && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-foreground mb-3 text-sm">Adicionar Material</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                      <input
                        type="text"
                        value={matNome}
                        onChange={(e) => setMatNome(e.target.value)}
                        placeholder="Material"
                        className="col-span-2 sm:col-span-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none"
                      />
                      <input
                        type="number"
                        value={matQtd}
                        onChange={(e) => setMatQtd(e.target.value)}
                        placeholder="Qtd"
                        min="0"
                        step="0.1"
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none"
                      />
                      <select
                        value={matUnidade}
                        onChange={(e) => setMatUnidade(e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none bg-white"
                      >
                        <option>unidades</option>
                        <option>folhas</option>
                        <option>metros</option>
                        <option>cm</option>
                        <option>gramas</option>
                        <option>ml</option>
                      </select>
                      <input
                        type="number"
                        value={matPreco}
                        onChange={(e) => setMatPreco(e.target.value)}
                        placeholder="Preço unit. (R$)"
                        min="0"
                        step="0.01"
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={adicionarMaterial}
                      disabled={!matNome || !matQtd || !matPreco}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>

                  {materiais.length === 0 ? (
                    <p className="text-center text-muted text-sm py-8">
                      Nenhum material adicionado ainda.<br />
                      Use o formulário acima para adicionar.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {materiais.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                        >
                          <div>
                            <span className="font-semibold text-sm text-foreground">{m.nome}</span>
                            <span className="text-muted text-xs ml-2">
                              {m.quantidade} {m.unidade} × {fmt(m.precoUnitario)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-sm text-primary">
                              {fmt(m.quantidade * m.precoUnitario)}
                            </span>
                            <button
                              onClick={() => removerMaterial(m.id)}
                              className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center px-4 py-2 bg-primary/5 rounded-xl">
                        <span className="text-sm font-semibold text-foreground">Total Materiais</span>
                        <span className="font-bold text-primary">{fmt(custoMateriais)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── ABA: TEMPO ── */}
              {activeTab === "tempo" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      ⏱️ Tempo de Produção
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted mb-1.5">Horas</label>
                        <input
                          type="number"
                          value={horas}
                          onChange={(e) => setHoras(e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted mb-1.5">Minutos</label>
                        <input
                          type="number"
                          value={minutos}
                          onChange={(e) => setMinutos(e.target.value)}
                          placeholder="0"
                          min="0"
                          max="59"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Nível de Experiência</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {(["iniciante", "intermediaria", "avancada"] as NivelExperiencia[]).map((nivel) => (
                        <button
                          key={nivel}
                          onClick={() => setNivelExp(nivel)}
                          className={`py-4 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            nivelExp === nivel
                              ? "border-primary bg-primary text-white"
                              : "border-gray-200 text-muted hover:border-gray-300"
                          }`}
                        >
                          <span className="font-bold text-base">
                            R${valorHora[nivel]}/h
                          </span>
                          <span className="text-xs opacity-80">
                            {nivel === "iniciante" ? "Iniciante" : nivel === "intermediaria" ? "Intermediária" : "Avançada"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-xl px-4 py-3 flex justify-between items-center">
                    <div>
                      <span className="text-sm font-semibold text-foreground">Custo da Mão de Obra</span>
                      <p className="text-xs text-muted">
                        {tempoTotal.toFixed(2)}h × R${valorHora[nivelExp]}/h
                      </p>
                    </div>
                    <span className="font-bold text-primary text-lg">{fmt(custoMaoObra)}</span>
                  </div>
                </div>
              )}

              {/* ── ABA: DESPESAS ── */}
              {activeTab === "despesas" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                        📦 Embalagem (R$)
                      </label>
                      <input
                        type="number"
                        value={embalagem}
                        onChange={(e) => setEmbalagem(e.target.value)}
                        placeholder="0,00"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-foreground bg-white"
                      />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                        🚚 Transporte (R$)
                      </label>
                      <input
                        type="number"
                        value={transporte}
                        onChange={(e) => setTransporte(e.target.value)}
                        placeholder="0,00"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-foreground bg-white"
                      />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                        💳 Taxa da Plataforma (%)
                      </label>
                      <input
                        type="number"
                        value={taxaPlataforma}
                        onChange={(e) => setTaxaPlataforma(e.target.value)}
                        placeholder="Ex: 16 para Shopee"
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-foreground bg-white"
                      />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                        💰 Outros Custos (R$)
                      </label>
                      <input
                        type="number"
                        value={outrosCustos}
                        onChange={(e) => setOutrosCustos(e.target.value)}
                        placeholder="0,00"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-foreground bg-white"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-amber-800 text-sm mb-3">Resumo das Despesas Extras</h4>
                    {[
                      { label: "Embalagem", value: parseFloat(embalagem) || 0 },
                      { label: "Transporte", value: parseFloat(transporte) || 0 },
                      { label: `Taxa plataforma (${taxaPlataformaNum}%)`, value: taxaPlataformaValor },
                      { label: "Outros custos", value: parseFloat(outrosCustos) || 0 },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-muted">{label}:</span>
                        <span className="font-semibold text-foreground">{fmt(value)}</span>
                      </div>
                    ))}
                    <div className="border-t border-amber-200 pt-2 flex justify-between font-bold text-amber-800">
                      <span>Total Despesas Extras:</span>
                      <span>{fmt(totalDespesas)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── ABA: MARGEM ── */}
              {activeTab === "margem" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      📈 Margem de Lucro Desejada
                    </label>
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="number"
                        value={margem}
                        onChange={(e) => setMargem(e.target.value)}
                        min="0"
                        max="500"
                        className="w-28 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-foreground font-bold text-lg"
                      />
                      <span className="text-2xl font-bold text-muted">%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={Math.min(parseFloat(margem) || 0, 200)}
                      onChange={(e) => setMargem(e.target.value)}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                      <span>150%</span>
                      <span>200%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { value: "0", label: "0%", desc: "Sem lucro" },
                      { value: "25", label: "25%", desc: "Margem baixa" },
                      { value: "50", label: "50%", desc: "Moderada" },
                      { value: "75", label: "75%", desc: "Boa" },
                      { value: "100", label: "100%", desc: "Alta" },
                    ].map(({ value, label, desc }) => (
                      <button
                        key={value}
                        onClick={() => setMargem(value)}
                        className={`py-3 rounded-xl border-2 text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          margem === value
                            ? "border-primary bg-primary text-white"
                            : "border-gray-200 text-muted hover:border-gray-300"
                        }`}
                      >
                        <span className="font-bold text-sm">{label}</span>
                        <span className="opacity-80 leading-tight text-center">{desc}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-1.5 text-sm">
                    <h4 className="font-semibold text-blue-800 mb-2">Sobre a Margem de Lucro</h4>
                    <p className="text-blue-700"><strong>0–25%:</strong> Margem baixa, cobre apenas custos básicos</p>
                    <p className="text-blue-700"><strong>25–50%:</strong> Margem moderada, permite crescimento</p>
                    <p className="text-blue-700"><strong>50–100%:</strong> Margem boa, permite reinvestimento</p>
                    <p className="text-blue-700"><strong>100%+:</strong> Margem alta, produtos premium ou únicos</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navegação entre abas */}
            <div className="flex justify-between mt-3">
              <button
                onClick={() => {
                  const idx = tabs.findIndex((t) => t.id === activeTab);
                  if (idx > 0) setActiveTab(tabs[idx - 1].id);
                }}
                disabled={activeTab === "produto"}
                className="px-4 py-2 text-sm font-semibold text-muted border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-0 cursor-pointer"
              >
                ← Anterior
              </button>
              <button
                onClick={() => {
                  const idx = tabs.findIndex((t) => t.id === activeTab);
                  if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
                }}
                disabled={activeTab === "margem"}
                className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:opacity-90 disabled:opacity-0 cursor-pointer"
              >
                Próximo →
              </button>
            </div>
          </div>

          {/* ── Painel direito — Resultado Final ── */}
          <div className="lg:w-80 xl:w-96">
            <div className="bg-gradient-to-br from-[#C1440E] to-[#8B2E06] rounded-2xl p-5 text-white sticky top-24">
              <h2 className="font-marker text-xl mb-4 flex items-center gap-2">
                🧮 Resultado Final
                {nomePeca && <span className="text-sm font-normal opacity-80 truncate">— {nomePeca}</span>}
              </h2>

              {/* Composição dos custos */}
              <div className="bg-white/10 rounded-xl p-4 mb-3 space-y-2 text-sm">
                <h3 className="font-semibold text-orange-100 flex items-center gap-1.5 mb-3">
                  💰 Composição dos Custos
                </h3>
                <div className="flex justify-between">
                  <span className="text-orange-200">Materiais:</span>
                  <span className="font-semibold">{fmt(custoMateriais)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-200">Mão de obra:</span>
                  <span className="font-semibold">{fmt(custoMaoObra)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-200">Despesas extras:</span>
                  <span className="font-semibold">{fmt(totalDespesas)}</span>
                </div>
                <div className="border-t border-white/20 pt-2 flex justify-between font-bold">
                  <span>Custo Total:</span>
                  <span>{fmt(custoTotal)}</span>
                </div>
              </div>

              {/* Preço Mínimo */}
              <div className="bg-white/10 rounded-xl p-4 mb-3">
                <p className="text-orange-200 text-xs font-semibold mb-1">🛒 Preço Mínimo</p>
                <p className="text-3xl font-bold">{fmt(precoMinimo)}</p>
                <p className="text-orange-300 text-xs">(sem lucro)</p>
              </div>

              {/* Preço Sugerido */}
              <div className="bg-white/20 rounded-xl p-4 mb-3">
                <p className="text-orange-100 text-xs font-semibold mb-1">
                  📈 Preço Sugerido (com {margemNum}% de lucro)
                </p>
                <p className="text-3xl font-bold">{fmt(precoSugerido)}</p>
                <p className="text-orange-200 text-xs">Preço Premium: {fmt(precoPremium)}</p>
              </div>

              {/* Lucro */}
              <div className="bg-[#2D6A4F] rounded-xl p-4 mb-3">
                <p className="text-green-200 text-xs font-semibold mb-1">💵 Seu lucro por peça:</p>
                <p className="text-2xl font-bold">{fmt(lucroPorPeca)}</p>
              </div>

              {/* Metas mensais */}
              {lucroPorPeca > 0 && (
                <div className="bg-white/10 rounded-xl p-4 space-y-2 text-sm">
                  <p className="text-orange-100 font-semibold text-xs mb-2">🎯 Para atingir sua meta mensal:</p>
                  <div className="flex justify-between">
                    <span className="text-orange-200">Para R$1.000/mês:</span>
                    <span className="font-bold">{pecasParaMil} peças</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-200">Para R$5.000/mês:</span>
                    <span className="font-bold">{pecasParaCincoMil} peças</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabela de referência do mercado ── */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-marker text-xl text-foreground mb-4">
            📊 Tabela de Referência — O que o mercado cobra
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Peça</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Tamanho</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Mercado paga</th>
                </tr>
              </thead>
              <tbody>
                {TABELA_MERCADO.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-50 ${i % 2 === 0 ? "bg-gray-50/50" : ""}`}
                  >
                    <td className="py-3 px-4 font-semibold text-foreground">{row.peca}</td>
                    <td className="py-3 px-4 text-muted">{row.tamanho}</td>
                    <td className="py-3 px-4 font-bold text-primary">{row.faixa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-4">
            * Valores de referência baseados em pesquisa de mercado. Os preços reais podem variar conforme região, canal de venda e acabamento.
          </p>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-muted mt-8">
        Papercraft Brasil © {new Date().getFullYear()} — Todos os direitos reservados
      </footer>
    </div>
  );
}

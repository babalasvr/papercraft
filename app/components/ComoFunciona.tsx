const steps = [
  {
    number: "01",
    emoji: "🗂️",
    title: "Escolha seu Modelo",
    description:
      "Acesse o acervo com mais de 1200 moldes e escolha o boneco que você quer montar — do mais simples ao mais elaborado.",
    badgeColor: "bg-[#C1440E]",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    rotation: "-rotate-1",
  },
  {
    number: "02",
    emoji: "🖨️",
    title: "Imprima em Casa",
    description:
      "Basta imprimir as páginas do modelo em qualquer impressora comum. Sem equipamentos especiais — papel A4 serve perfeitamente!",
    badgeColor: "bg-[#D4A574]",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    rotation: "rotate-1",
  },
  {
    number: "03",
    emoji: "✂️",
    title: "Monte e Apresente",
    description:
      "Com tesoura, cola e paciência, siga o guia passo a passo e veja seu boneco 3D ganhar vida. Depois, mostre para todo mundo!",
    badgeColor: "bg-[#2D6A4F]",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    rotation: "-rotate-1",
  },
];

export default function ComoFunciona() {
  return (
    <section
      className="py-20 px-4"
      id="como-funciona"
      style={{ backgroundColor: "#FFF8F0" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#C1440E] font-semibold uppercase tracking-widest text-sm mb-2">
            Simples assim
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#3D2B1F]"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            Como Funciona?
          </h2>
          <p className="text-[#6B5B4F] mt-3 text-lg max-w-xl mx-auto">
            Em 3 passos simples você já está criando seus bonecos de papel 3D
          </p>
        </div>

        {/* Steps */}
        <div className="relative flex flex-col md:flex-row items-start justify-center gap-8 md:gap-0">
          {/* Dashed connecting line (desktop) */}
          <div
            className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 border-t-2 border-dashed border-gray-300 z-0"
            style={{ left: "16.5%", right: "16.5%" }}
          />

          {steps.map((step, i) => (
            <div key={i} className="flex-1 flex justify-center relative z-10 px-4">
              {/* Sticky note card */}
              <div
                className={`${step.bgColor} border-2 ${step.borderColor} ${step.rotation} p-6 rounded-lg shadow-lg w-full max-w-xs relative`}
                style={{ boxShadow: "3px 3px 10px rgba(0,0,0,0.1)" }}
              >
                {/* Number badge */}
                <div
                  className={`absolute -top-4 -left-4 ${step.badgeColor} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white`}
                  style={{ fontFamily: '"Permanent Marker", cursive' }}
                >
                  {step.number}
                </div>

                {/* Emoji */}
                <div className="text-5xl mb-4 text-center">{step.emoji}</div>

                {/* Title */}
                <h3
                  className="text-xl font-bold text-[#3D2B1F] mb-3 text-center"
                  style={{ fontFamily: '"Permanent Marker", cursive' }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[#6B5B4F] text-sm leading-relaxed text-center">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA depois dos passos */}
        <div className="text-center mt-14">
          <p className="text-[#6B5B4F] text-base mb-4">
            Simples assim. Em minutos você já tem seu primeiro boneco 3D.
          </p>
          <a
            href="#pricing"
            className="inline-block text-white text-lg font-bold px-12 py-4 rounded-2xl cursor-pointer no-underline border-2 border-[#1B4332] active:translate-y-1 transition-transform"
            style={{
              fontFamily: '"Permanent Marker", cursive',
              backgroundColor: "#2D6A4F",
              boxShadow: "0 6px 0 0 #1B4332",
            }}
          >
            QUERO COMEÇAR AGORA
          </a>
        </div>
      </div>
    </section>
  );
}

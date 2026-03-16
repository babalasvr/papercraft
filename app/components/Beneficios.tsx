const features = [
  {
    image: "/img/PAPER-02-P.png",
    title: "Seu Cantinho Anti-Estresse",
    description:
      "Depois de um dia puxado, separe 30 minutinhos, coloque uma música e monte sua próxima peça. É o tipo de hobby que acalma a mente e ainda deixa um resultado lindo na prateleira.",
    tape: "bg-[#D4A574]",
    rotate: "-rotate-2",
    caption: "Terapia de papel!",
  },
  {
    image: "/img/PAPER-03-P.png",
    title: "Presente Que Ninguém Esquece",
    description:
      "Imagina entregar um boneco 3D feito por você. A pessoa não vai acreditar que saiu de uma folha de papel. É o tipo de presente que fica guardado pra sempre.",
    tape: "bg-[#E8D5C0]",
    rotate: "rotate-1",
    caption: "Feito com as mãos!",
  },
  {
    image: "/img/PAPER-04-P.png",
    title: "Programa Perfeito Em Família",
    description:
      "Chama as crianças, desliga a TV e bota todo mundo pra montar junto. Em poucos minutos já tem risada, concentração e aquele orgulho de ver o boneco pronto.",
    tape: "bg-[#C1440E]/30",
    rotate: "-rotate-1",
    caption: "Memórias pra vida!",
  },
];

export default function Beneficios() {
  return (
    <section
      className="relative py-20 px-4 overflow-hidden"
      id="beneficios"
      style={{
        backgroundImage:
          "linear-gradient(to right, #E8D5C0 1px, transparent 1px), linear-gradient(#E8D5C0 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        backgroundColor: "#FFF8F0",
      }}
    >
      {/* Section header */}
      <div className="max-w-6xl mx-auto text-center mb-14">
        <p className="text-[#C1440E] font-semibold text-lg mb-2 uppercase tracking-widest">
          Mais que um hobby...
        </p>
        <h2
          className="text-4xl md:text-5xl font-bold text-[#3D2B1F]"
          style={{ fontFamily: '"Permanent Marker", cursive' }}
        >
          3 motivos pra começar<br className="hidden md:block" />
          ainda hoje
        </h2>
      </div>

      {/* Cards grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
        {features.map((f, i) => (
          <div key={i} className="flex justify-center">
            <div className={`polaroid ${f.rotate} w-full max-w-xs relative`}>
              {/* Tape decoration */}
              <div
                className={`absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-7 ${f.tape} opacity-80 rounded-sm`}
                style={{ transform: "translateX(-50%) rotate(-2deg)" }}
              />

              {/* Image */}
              <div className="w-full h-48 overflow-hidden rounded-sm">
                <img
                  src={f.image}
                  alt={f.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="pt-4 pb-2">
                <h3
                  className="text-xl font-bold text-[#3D2B1F] mb-2"
                  style={{ fontFamily: '"Permanent Marker", cursive' }}
                >
                  {f.title}
                </h3>
                <p className="text-[#6B5B4F] text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>

              {/* Polaroid caption */}
              <p
                className="text-center text-gray-400 text-xs mt-1"
                style={{ fontFamily: '"Permanent Marker", cursive' }}
              >
                {f.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const features = [
  {
    image: "https://i.ibb.co/TBCgR7TY/PAPER-02-P.webp",
    title: "Desconecte Do Estresse",
    description:
      "Expresse sua arte com centenas de modelos exclusivos. Cada peça é única e feita com suas próprias mãos — um hobby que desenvolve habilidades visuais e motoras.",
    tape: "bg-pink-300",
    rotate: "-rotate-2",
    caption: "Arte que você cria!",
  },
  {
    image: "https://i.ibb.co/hxVtvyX4/PAPER-03-P.webp",
    title: "Decoração Com Identidade",
    description:
      "Surpreenda amigos e família com presentes personalizados e cheios de carinho. Um boneco de papel feito à mão tem muito mais valor que qualquer presente comprado.",
    tape: "bg-yellow-300",
    rotate: "rotate-1",
    caption: "Presente com amor!",
  },
  {
    image: "https://i.ibb.co/sp7snLBR/PAPER-04-P.webp",
    title: "Tempo De Qualidade",
    description:
      "Reúna todo mundo em torno de uma mesa e criem juntos! Atividade ideal para crianças, adolescentes e adultos — sem tela, sem estresse, só alegria.",
    tape: "bg-blue-300",
    rotate: "-rotate-1",
    caption: "Momento especial!",
  },
];

export default function Beneficios() {
  return (
    <section
      className="relative py-20 px-4 overflow-hidden"
      id="beneficios"
      style={{
        backgroundImage:
          "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(#e2e8f0 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* Section header */}
      <div className="max-w-6xl mx-auto text-center mb-14">
        <p className="text-[#0188FA] font-semibold text-lg mb-2 uppercase tracking-widest">
          Mais que um hobby...
        </p>
        <h2
          className="text-4xl md:text-5xl font-bold text-[#0F172A]"
          style={{ fontFamily: '"Permanent Marker", cursive' }}
        >
          Por que o Papercraft <br className="hidden md:block" />
          vai mudar sua vida?
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
                  className="text-xl font-bold text-[#0F172A] mb-2"
                  style={{ fontFamily: '"Permanent Marker", cursive' }}
                >
                  {f.title}
                </h3>
                <p className="text-[#475569] text-sm leading-relaxed">
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

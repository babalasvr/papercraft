const testimonials = [
  {
    name: "Pedro Reis",
    productImage: "/img/PAPER-13-P.png",
    avatarImage: "/img/PROVA-02-P.webp",
    quote:
      "Já montei mais de 30 peças e cada uma fica melhor que a anterior. Os moldes encaixam certinho e o passo a passo é tão claro que até minha sogra conseguiu montar um sozinha!",
    stars: 5,
    rotate: "-rotate-2",
    tape: "bg-[#D4A574]",
  },
  {
    name: "Ana Prado",
    productImage: "/img/PAPER-14-P.png",
    avatarImage: "/img/PROVA-03-P.webp",
    quote:
      "Virou minha terapia do fim do dia. Chego do trabalho, pego um molde novo e em 1 hora já esqueço de tudo. Minha estante tá cheia e todo mundo que visita quer saber onde comprei!",
    stars: 5,
    rotate: "rotate-1",
    tape: "bg-[#E8D5C0]",
  },
  {
    name: "Robson Martins",
    productImage: "/img/PAPER-15-P.png",
    avatarImage: "/img/PROVA-05-P.webp",
    quote:
      "Comprei pro meu filho de 12 anos e agora virou programa de família. No fim de semana sentamos juntos e cada um monta o seu. Ele já ensinou até os amigos da escola!",
    stars: 5,
    rotate: "-rotate-1",
    tape: "bg-[#C1440E]/30",
  },
];

export default function Testemunhos() {
  return (
    <section
      className="py-20 px-4"
      id="testemunhos"
      style={{
        backgroundImage:
          "linear-gradient(to right, #E8D5C0 1px, transparent 1px), linear-gradient(#E8D5C0 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        backgroundColor: "#FFF8F0",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#C1440E] font-semibold uppercase tracking-widest text-sm mb-2">
            +3000 alunos satisfeitos
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#3D2B1F]"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            Veja quem já começou
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <div key={i} className="flex justify-center">
              <div className={`polaroid ${t.rotate} w-full max-w-xs relative`}>
                {/* Tape */}
                <div
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-7 ${t.tape} opacity-80 rounded-sm`}
                  style={{ transform: "translateX(-50%) rotate(-2deg)" }}
                />

                {/* Product photo */}
                <div className="w-full h-48 overflow-hidden rounded-sm">
                  <img
                    src={t.productImage}
                    alt={`Produto de ${t.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Stars */}
                <div className="flex justify-center mt-3 text-amber-600 text-lg">
                  {"★".repeat(t.stars)}
                </div>

                {/* Quote */}
                <blockquote
                  className="text-gray-700 mt-3 italic leading-relaxed"
                  style={{ fontFamily: '"Permanent Marker", cursive', fontSize: "0.85rem" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Avatar + name row */}
                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={t.avatarImage}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                  <p
                    className="text-gray-600 text-sm font-bold"
                    style={{ fontFamily: '"Permanent Marker", cursive' }}
                  >
                    — {t.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA depois dos depoimentos */}
        <div className="text-center mt-14">
          <a
            href="#pricing"
            className="inline-block text-white text-lg font-bold px-12 py-4 rounded-2xl cursor-pointer no-underline border-2 border-[#1B4332] active:translate-y-1 transition-transform"
            style={{
              fontFamily: '"Permanent Marker", cursive',
              backgroundColor: "#2D6A4F",
              boxShadow: "0 6px 0 0 #1B4332",
            }}
          >
            QUERO CRIAR OS MEUS TAMBÉM
          </a>
          <p className="text-[#6B5B4F] text-sm mt-3">Acesso imediato após a compra</p>
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Pedro Reis",
    productImage: "https://i.ibb.co/whPg9DBk/PAPER-13-P.webp",
    avatarImage: "https://i.ibb.co/HfhmZXcF/PROVA-02-P.webp",
    quote:
      "Cara, que produto incrível! Comprei o Kit Mestre e já montei mais de 30 peças. Os moldes são precisos, as instruções são claras. Não tem como errar!",
    stars: 5,
    rotate: "-rotate-2",
    tape: "bg-pink-300",
  },
  {
    name: "Ana Prado",
    productImage: "https://i.ibb.co/xy7Y0q8/PAPER-14-P.webp",
    avatarImage: "https://i.ibb.co/v4RZ2DFg/PROVA-03-P.webp",
    quote:
      "Uso como terapia! Depois de um dia estressante, fico 1 hora montando e esqueço todos os problemas. Minha casa tá virando um museu de papercraft kk",
    stars: 5,
    rotate: "rotate-1",
    tape: "bg-yellow-300",
  },
  {
    name: "Robson Martins",
    productImage: "https://i.ibb.co/WvfXR2z1/PAPER-15-P.webp",
    avatarImage: "https://i.ibb.co/4ngSgGCK/PROVA-05-P.webp",
    quote:
      "Dei de presente pro meu filho de 12 anos e agora ele não larga. Ficou tão viciado que pediu pra ensinar os amigos. Melhor compra que fiz esse ano!",
    stars: 5,
    rotate: "-rotate-1",
    tape: "bg-blue-300",
  },
];

export default function Testemunhos() {
  return (
    <section
      className="py-20 px-4"
      id="testemunhos"
      style={{
        backgroundImage:
          "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(#e2e8f0 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        backgroundColor: "#f8fafc",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#0188FA] font-semibold uppercase tracking-widest text-sm mb-2">
            Depoimentos Reais
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#0F172A]"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            O que nossos alunos dizem
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
                <div className="flex justify-center mt-3 text-yellow-400 text-lg">
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
      </div>
    </section>
  );
}

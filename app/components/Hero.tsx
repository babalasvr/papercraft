export default function Hero() {
  const avatars = [
    "/img/PROVA-01-P.webp",
    "/img/PROVA-02-P.webp",
    "/img/PROVA-03-P.webp",
    "/img/PROVA-04-P.webp",
  ];

  return (
    <section className="relative bg-[#FDFDFD] overflow-hidden py-12 px-4">
      <div className="max-w-lg mx-auto flex flex-col items-center text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 border-2 border-green-400 text-green-600 bg-white px-4 py-1.5 rounded-full text-xs font-bold mb-6 shadow-sm">
          <span className="text-green-500">✓</span>
          <span>+3500 MOLDES PRONTOS PRA IMPRIMIR</span>
        </div>

        {/* H1 */}
        <h1
          className="text-5xl md:text-6xl font-bold text-[#0F172A] leading-tight mb-2 uppercase"
          style={{ fontFamily: '"Permanent Marker", cursive' }}
        >
          Transforme Papel<br />em Arte
        </h1>
        <div className="relative mb-5">
          <span
            className="text-5xl md:text-6xl font-bold uppercase"
            style={{
              fontFamily: '"Permanent Marker", cursive',
              color: "#0188FA",
            }}
          >
            3D Incrível
          </span>
          {/* Underline decoration */}
          <svg
            className="absolute -bottom-3 left-0 w-full"
            height="10"
            viewBox="0 0 300 10"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,5 Q75,0 150,5 Q225,10 300,5"
              fill="none"
              stroke="#0188FA"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Subtitle - sem aspas, foco em beneficio */}
        <p className="text-base text-[#475569] mb-5 max-w-sm leading-relaxed">
          Com apenas tesoura e cola, crie bonecos 3D impressionantes para decorar, presentear e relaxar — <strong className="text-[#0F172A]">mesmo sem experiência nenhuma</strong>.
        </p>

        {/* CTA Button ACIMA DA DOBRA */}
        <a
          href="#pricing"
          className="inline-block text-white text-xl font-bold px-14 py-4 rounded-2xl mb-5 cursor-pointer no-underline border-2 border-[#16A34A] active:translate-y-1 transition-transform"
          style={{
            fontFamily: '"Permanent Marker", cursive',
            backgroundColor: "#22C55E",
            boxShadow: "0 6px 0 0 #16A34A",
          }}
        >
          QUERO COMEÇAR AGORA
        </a>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex -space-x-2">
            {avatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Aluno ${i + 1}`}
                className="w-9 h-9 rounded-full border-2 border-white shadow object-cover"
              />
            ))}
          </div>
          <div className="text-left">
            <div className="flex text-yellow-400 text-sm">{"★★★★★"}</div>
            <p className="text-[#475569] text-xs">
              <strong className="text-[#0F172A]">+3000 alunos felizes</strong>
            </p>
          </div>
        </div>

        {/* Polaroid image */}
        <div className="relative w-full max-w-xs mb-4">
          {/* Yellow tape at top */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-16 h-6 bg-yellow-200 opacity-80"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}
          />

          {/* Floating label LEFT */}
          <div
            className="absolute -left-8 bottom-16 z-20 bg-[#0188FA] text-white font-bold px-3 py-2 rounded-xl shadow-lg text-xs leading-tight text-center"
            style={{
              fontFamily: '"Permanent Marker", cursive',
              transform: "rotate(-8deg)",
            }}
          >
            FÁCIL DE<br />MONTAR!
          </div>

          {/* Polaroid frame */}
          <div
            className="bg-white p-3 pb-10 shadow-2xl w-full relative z-10"
            style={{ transform: "rotate(1deg)" }}
          >
            <img
              src="/img/PAPER-01-3-P.png"
              alt="Papercraft 3D"
              className="w-full h-72 object-cover"
            />
            {/* "FEITO POR VOCÊ!" text inside polaroid bottom-right */}
            <p
              className="absolute bottom-2 right-4 text-gray-500 text-sm"
              style={{ fontFamily: '"Permanent Marker", cursive' }}
            >
              FEITO POR VOCÊ!
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

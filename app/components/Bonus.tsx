const bonuses = [
  {
    image: "/img/PAPER-16-P.webp",
    title: "Zoológico de Papercraft",
    value: "R$47",
    rotate: "-rotate-1",
  },
  {
    image: "/img/PAPER-17-P.webp",
    title: "Heróis de Papercraft",
    value: "R$37",
    rotate: "rotate-1",
  },
  {
    image: "/img/PAPER-18-P.webp",
    title: "Animes e Mangás",
    value: "R$27",
    rotate: "-rotate-1",
  },
  {
    image: "/img/PAPER-19-P.webp",
    title: "Garagem de Carros",
    value: "R$19",
    rotate: "rotate-1",
  },
];

export default function Bonus() {
  return (
    <section
      className="relative py-20 px-4 overflow-hidden"
      id="bonus"
      style={{ backgroundColor: "#0A3622" }}
    >
      {/* SVG Wave Top */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          style={{ display: "block" }}
          preserveAspectRatio="none"
        >
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" fill="#f8fafc" />
        </svg>
      </div>

      {/* SVG Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          style={{ display: "block" }}
          preserveAspectRatio="none"
        >
          <path d="M0,40 C360,0 1080,80 1440,40 L1440,80 L0,80 Z" fill="#FDFDFD" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-block bg-[#FDC700] text-black font-bold px-5 py-2 rounded-full text-sm mb-4 shadow-lg"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            Presentes pra você
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            BÔNUS EXCLUSIVOS GRÁTIS
          </h2>
          <p className="text-green-300 mt-3 text-lg">
            Incluídos no Kit Mestre — valor total de{" "}
            <span className="font-bold text-[#FDC700]">R$ 130</span> em bônus
          </p>
        </div>

        {/* Bonus cards - 2 column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bonuses.map((bonus, i) => (
            <div
              key={i}
              className={`bg-white rounded-[4px] shadow-2xl p-4 relative flex flex-row gap-4 items-center ${bonus.rotate}`}
            >
              {/* Image left */}
              <img
                src={bonus.image}
                alt={bonus.title}
                className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
              />

              {/* Text right */}
              <div className="flex-1">
                <span className="inline-block bg-[#22C55E] text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                  BONUS KIT MESTRE
                </span>
                <h3
                  className="text-[#0F172A] font-bold text-lg mb-1"
                  style={{ fontFamily: '"Permanent Marker", cursive' }}
                >
                  {bonus.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  Vendido por{" "}
                  <span className="line-through text-gray-400">{bonus.value}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total value */}
        <div className="text-center mt-10">
          <p className="text-white text-lg">
            Total em bônus:{" "}
            <span className="line-through text-gray-400">R$ 130</span>{" "}
            <span
              className="text-[#FDC700] text-2xl font-bold"
              style={{ fontFamily: '"Permanent Marker", cursive' }}
            >
              GRÁTIS pra você!
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

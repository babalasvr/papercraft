import Image from "next/image";
import modulo01 from "../../public/img/MODULO-01-VAI-RECEBER-P.webp";
import modulo02 from "../../public/img/MODULO-02-VAI-RECEBER-P.webp";
import modulo03 from "../../public/img/MODULO-03-VAI-RECEBER-P.webp";

const moduloImages = [
  { src: modulo01, alt: "Módulo 1" },
  { src: modulo02, alt: "Módulo 2" },
  { src: modulo03, alt: "Módulo 3" },
];

export default function Modelos() {
  return (
    <section
      className="relative py-20 px-4 overflow-hidden"
      id="modelos"
      style={{
        backgroundImage:
          "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(#e2e8f0 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        backgroundColor: "#f8fafc",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#0188FA] font-semibold text-lg mb-3 italic">
            Moldes reais do kit!
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#0F172A]"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            Veja por dentro o que<br className="hidden md:block" /> você vai receber
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {moduloImages.map((img, i) => (
            <div key={i} className="overflow-hidden rounded-xl shadow-lg">
              <Image
                src={img.src}
                alt={img.alt}
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

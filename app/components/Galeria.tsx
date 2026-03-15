const galleryImages = [
  "https://i.ibb.co/Vpj2ZpSD/PAPER-05-P.webp",
  "https://i.ibb.co/tw31Vy78/PAPER-06-P.webp",
  "https://i.ibb.co/fzBt2BGW/PAPER-07-P.webp",
  "https://i.ibb.co/spvjSQF5/PAPER-08-P.webp",
  "https://i.ibb.co/0y00vjdB/PAPER-09-P.webp",
  "https://i.ibb.co/fdV5XZ4X/PAPER-10-P.webp",
  "https://i.ibb.co/JwqXpswg/PAPER-11-P.webp",
  "https://i.ibb.co/MytSzFw1/PAPER-12-P.webp",
];

export default function Galeria() {
  return (
    <section className="py-20 px-4 bg-white" id="galeria">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#0188FA] font-semibold uppercase tracking-widest text-sm mb-2">
            Nossa Galeria
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#0F172A]"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            O Que Você Pode Criar
          </h2>
          <p className="text-[#475569] mt-3 text-lg max-w-xl mx-auto">
            Mais de 1200 modelos à sua espera — de iniciante a mestre do papercraft
          </p>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          {galleryImages.map((src, i) => (
            <div
              key={i}
              className="w-[280px] h-[350px] md:w-[350px] md:h-[420px] rounded-2xl overflow-hidden shadow-lg border-4 border-white flex-shrink-0 snap-center"
            >
              <img
                src={src}
                alt={`Papercraft modelo ${i + 5}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="text-[#475569] text-sm">
            E muito mais...{" "}
            <strong className="text-[#0188FA]">+1200 modelos</strong> no kit completo!
          </p>
        </div>
      </div>
    </section>
  );
}

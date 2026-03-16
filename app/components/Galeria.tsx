const galleryImages = [
  "/img/PAPER-05-P.png",
  "/img/PAPER-06-P.png",
  "/img/PAPER-07-P.png",
  "/img/PAPER-08-P.png",
  "/img/PAPER-09-P.png",
  "/img/PAPER-10-P.png",
  "/img/PAPER-11-P.png",
  "/img/PAPER-12-P.png",
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
            Mais de 3500 modelos à sua espera — de iniciante a mestre do papercraft
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
          <p className="text-[#475569] text-sm mb-5">
            E muito mais...{" "}
            <strong className="text-[#0188FA]">+3500 modelos</strong> esperando por você!
          </p>
          <a
            href="#pricing"
            className="inline-block text-white text-lg font-bold px-12 py-4 rounded-2xl cursor-pointer no-underline border-2 border-[#16A34A] active:translate-y-1 transition-transform"
            style={{
              fontFamily: '"Permanent Marker", cursive',
              backgroundColor: "#22C55E",
              boxShadow: "0 6px 0 0 #16A34A",
            }}
          >
            QUERO CRIAR OS MEUS
          </a>
        </div>
      </div>
    </section>
  );
}

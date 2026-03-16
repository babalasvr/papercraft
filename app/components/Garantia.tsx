import { ShieldCheck } from "lucide-react";

export default function Garantia() {
  return (
    <section className="py-20 px-4 bg-[#FFF8F0]" id="garantia">
      <div className="max-w-4xl mx-auto">
        <div
          className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-white text-center shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #C1440E 0%, #8B2E06 100%)",
          }}
        >
          {/* Floating circular badge */}
          <div
            className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-[#D4A574] flex flex-col items-center justify-center shadow-xl border-4 border-white animate-bounce-slow"
          >
            <span className="text-2xl font-black text-black leading-tight"
              style={{ fontFamily: '"Permanent Marker", cursive' }}>7</span>
            <span className="text-xs font-bold text-black uppercase leading-tight">dias</span>
            <span className="text-xs font-bold text-black uppercase leading-tight">grátis</span>
          </div>

          {/* Shield icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldCheck size={44} className="text-white" />
            </div>
          </div>

          {/* Title */}
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            Não gostou? Devolvemos tudo.
          </h2>

          {/* Description */}
          <p className="text-orange-100 text-lg max-w-2xl mx-auto leading-relaxed mb-6">
            Você tem <strong className="text-white">7 dias</strong> pra testar o kit inteiro. Se não amar o conteúdo — por qualquer motivo — devolvemos{" "}
            <strong className="text-white">100% do seu dinheiro</strong>. Um e-mail e pronto. Sem perguntas, sem burocracia.</p>

          {/* Bullets */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            {["✅ Reembolso total garantido", "✅ Sem burocracia", "✅ Devolução em até 5 dias úteis"].map(
              (item, i) => (
                <span key={i} className="bg-white/20 px-4 py-2 rounded-full text-white font-medium">
                  {item}
                </span>
              )
            )}
          </div>

          {/* CTA */}
          <div className="mt-8">
            <a
              href="#pricing"
              className="inline-block bg-[#D4A574] text-black font-bold px-10 py-4 rounded-2xl text-xl border-2 border-black shadow-[0_6px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_3px_0_0_rgba(0,0,0,0.2)] hover:translate-y-[3px] transition-all duration-100 cursor-pointer"
              style={{ fontFamily: '"Permanent Marker", cursive' }}
            >
              Quero testar sem risco! 🛡️
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

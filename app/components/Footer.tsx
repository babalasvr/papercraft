import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#3D2B1F] text-white" id="footer">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Logo */}
          <div className="text-center md:text-left">
            <div
              className="text-4xl font-bold text-[#C1440E] mb-2"
              style={{ fontFamily: '"Permanent Marker", cursive' }}
            >
              PAPERCRAFT BRASIL
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              A maior plataforma de papercraft do Brasil. Transformando papel em arte desde 2022.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-8 text-center md:text-left">
            <div>
              <h4
                className="text-white font-bold mb-3 text-sm uppercase tracking-widest"
              >
                Produto
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#beneficios" className="hover:text-[#C1440E] transition-colors">Benefícios</a></li>
                <li><a href="#como-funciona" className="hover:text-[#C1440E] transition-colors">Como Funciona</a></li>
                <li><a href="#bonus" className="hover:text-[#C1440E] transition-colors">Bônus</a></li>
                <li><a href="#pricing" className="hover:text-[#C1440E] transition-colors">Preços</a></li>
              </ul>
            </div>
            <div>
              <h4
                className="text-white font-bold mb-3 text-sm uppercase tracking-widest"
              >
                Suporte
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#faq" className="hover:text-[#C1440E] transition-colors">FAQ</a></li>
                <li><a href="#garantia" className="hover:text-[#C1440E] transition-colors">Garantia</a></li>
                <li><a href="#" className="hover:text-[#C1440E] transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4
                className="text-white font-bold mb-3 text-sm uppercase tracking-widest"
              >
                Legal
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/privacidade" className="hover:text-[#C1440E] transition-colors">Política de Privacidade</Link></li>
                <li><Link href="/termos" className="hover:text-[#C1440E] transition-colors">Termos de Uso</Link></li>
                <li><Link href="/reembolso" className="hover:text-[#C1440E] transition-colors">Política de Reembolso</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 Papercraft Brasil. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600">Pagamento seguro:</span>
              <div className="flex gap-2">
                {["💳", "🏦", "📱"].map((icon, i) => (
                  <span
                    key={i}
                    className="bg-gray-800 rounded px-2 py-1 text-sm"
                    title={["Cartão", "Boleto", "Pix"][i]}
                  >
                    {icon}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-xs text-center mt-4 max-w-2xl mx-auto">
            Este produto não garante resultados específicos. Os depoimentos apresentados são casos reais de clientes satisfeitos, mas os resultados podem variar de pessoa para pessoa.
          </p>
        </div>
      </div>
    </footer>
  );
}

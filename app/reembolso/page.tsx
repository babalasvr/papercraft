import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Reembolso",
  description:
    "Garantia de 7 dias no Papercraft Brasil. Saiba como solicitar seu reembolso de forma simples e rápida.",
  alternates: { canonical: "https://papercraft-br.shop/reembolso" },
  robots: { index: true, follow: true },
};

export default function Reembolso() {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Header */}
      <header className="bg-[#0F172A] py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-[#0188FA] no-underline"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            PAPERCRAFT BRASIL
          </Link>
          <Link
            href="/"
            className="text-gray-400 text-sm hover:text-white transition-colors no-underline"
          >
            ← Voltar ao site
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-14">
        {/* Hero da garantia */}
        <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-8 text-center mb-12">
          <div className="text-6xl mb-4">🛡️</div>
          <h1
            className="text-4xl font-bold text-[#0F172A] mb-3"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            Garantia de 7 Dias
          </h1>
          <p className="text-green-700 text-lg font-semibold">
            Compra 100% segura. Se não ficar satisfeito, devolvemos seu dinheiro.
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-[#334155]">

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">1. Nossa Garantia</h2>
            <p>
              Acreditamos tanto na qualidade dos nossos kits que oferecemos uma
              garantia incondicional de <strong>7 (sete) dias corridos</strong> a
              partir da data da compra. Se por qualquer motivo você não ficar
              satisfeito, devolvemos 100% do valor pago — sem perguntas, sem
              burocracia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">2. Quem pode solicitar reembolso</h2>
            <p>Você tem direito ao reembolso se:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Sua compra foi realizada há <strong>menos de 7 dias corridos</strong></li>
              <li>O pedido foi feito diretamente em <strong>papercraft-br.shop</strong></li>
              <li>Você é o titular da compra (mesmo e-mail usado na compra)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">3. Como solicitar o reembolso</h2>
            <p>O processo é simples e rápido. Siga os passos:</p>
            <ol className="list-decimal pl-6 mt-2 space-y-3">
              <li>
                <strong>Envie um e-mail</strong> para{" "}
                <strong>contato@papercraft-br.shop</strong> com o assunto:{" "}
                <em>"Solicitação de Reembolso"</em>
              </li>
              <li>
                Informe no e-mail:
                <ul className="list-disc pl-6 mt-1 space-y-1 text-sm">
                  <li>Seu nome completo</li>
                  <li>E-mail usado na compra</li>
                  <li>Data da compra</li>
                  <li>Número do pedido (se disponível)</li>
                </ul>
              </li>
              <li>
                <strong>Aguarde o retorno</strong> — nossa equipe responde em até
                48 horas úteis
              </li>
              <li>
                Após a confirmação, o estorno é processado em{" "}
                <strong>até 7 dias úteis</strong> (o prazo pode variar conforme
                a operadora do cartão ou método de pagamento)
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">4. Prazo de estorno por forma de pagamento</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse mt-2 text-sm">
                <thead>
                  <tr className="bg-[#0F172A] text-white">
                    <th className="text-left p-3 rounded-tl-lg">Forma de Pagamento</th>
                    <th className="text-left p-3 rounded-tr-lg">Prazo de Estorno</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-3">Cartão de Crédito</td>
                    <td className="p-3">Até 2 faturas posteriores (prazo da operadora)</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="p-3">Pix</td>
                    <td className="p-3">Até 7 dias úteis</td>
                  </tr>
                  <tr>
                    <td className="p-3">Boleto Bancário</td>
                    <td className="p-3">Até 7 dias úteis (via transferência bancária)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">5. Situações não cobertas pela garantia</h2>
            <p>A garantia não se aplica quando:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>O prazo de 7 dias já expirou</li>
              <li>A compra foi feita por meio de revendedores não autorizados</li>
              <li>Há evidências de uso indevido dos moldes (revenda, distribuição)</li>
              <li>O pedido de reembolso for feito mais de uma vez para o mesmo produto</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">6. Direitos do Consumidor (CDC)</h2>
            <p>
              Esta política está em conformidade com o{" "}
              <strong>Código de Defesa do Consumidor (Lei nº 8.078/1990)</strong>,
              especialmente o Art. 49, que garante ao consumidor o direito de
              arrependimento em compras realizadas fora do estabelecimento
              comercial (compras online) no prazo de 7 dias.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">7. Dúvidas</h2>
            <p>
              Nossa equipe está pronta para ajudar. Entre em contato:
            </p>
            <ul className="list-none mt-2 space-y-1">
              <li>📧 <strong>contato@papercraft-br.shop</strong></li>
              <li>💬 WhatsApp disponível no site</li>
            </ul>
          </section>

        </div>

        {/* CTA de volta */}
        <div className="text-center mt-14">
          <Link
            href="/#pricing"
            className="inline-block text-white text-lg font-bold px-10 py-4 rounded-2xl no-underline"
            style={{
              fontFamily: '"Permanent Marker", cursive',
              backgroundColor: "#0188fa",
              boxShadow: "0 6px 0 0 #005BB5",
            }}
          >
            QUERO COMEÇAR COM GARANTIA
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A] py-6 px-4 mt-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2025 Papercraft Brasil. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacidade" className="hover:text-white transition-colors no-underline">Privacidade</Link>
            <Link href="/termos" className="hover:text-white transition-colors no-underline">Termos</Link>
            <Link href="/reembolso" className="hover:text-white transition-colors no-underline">Reembolso</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como o Papercraft Brasil coleta, usa e protege seus dados pessoais conforme a LGPD.",
  alternates: { canonical: "https://papercraft-br.shop/privacidade" },
  robots: { index: true, follow: true },
};

export default function Privacidade() {
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
        <h1
          className="text-4xl font-bold text-[#0F172A] mb-2"
          style={{ fontFamily: '"Permanent Marker", cursive' }}
        >
          Política de Privacidade
        </h1>
        <p className="text-gray-400 text-sm mb-10">
          Última atualização: 13 de março de 2025
        </p>

        <div className="prose prose-slate max-w-none space-y-8 text-[#334155]">

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">1. Quem somos</h2>
            <p>
              O <strong>Papercraft Brasil</strong>, acessível em{" "}
              <strong>papercraft-br.shop</strong>, é responsável pelo tratamento
              dos seus dados pessoais. Nosso compromisso é proteger sua
              privacidade e tratar seus dados com transparência, em conformidade
              com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">2. Dados que coletamos</h2>
            <p>Coletamos os seguintes dados quando você realiza uma compra ou entra em contato conosco:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Telefone / WhatsApp (quando fornecido)</li>
              <li>Dados de pagamento (processados de forma segura pela plataforma de pagamento — não armazenamos dados de cartão)</li>
              <li>Endereço IP e dados de navegação (via cookies)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">3. Como usamos seus dados</h2>
            <p>Seus dados são utilizados para:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Processar e entregar sua compra (acesso aos moldes)</li>
              <li>Enviar confirmações de pedido e informações de acesso por e-mail</li>
              <li>Oferecer suporte ao cliente</li>
              <li>Melhorar nossos produtos e serviços</li>
              <li>Enviar comunicações de marketing (somente com seu consentimento)</li>
              <li>Cumprir obrigações legais e fiscais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">4. Cookies</h2>
            <p>
              Utilizamos cookies essenciais para o funcionamento do site e cookies
              analíticos (Google Analytics) para entender como os visitantes
              utilizam nosso site. Você pode desativar os cookies no seu
              navegador, mas isso pode afetar algumas funcionalidades.
            </p>
            <p className="mt-2">Tipos de cookies utilizados:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Essenciais:</strong> necessários para o funcionamento básico do site</li>
              <li><strong>Analíticos:</strong> Google Analytics para medir tráfego e comportamento</li>
              <li><strong>Marketing:</strong> Meta Pixel / Google Ads para anúncios relevantes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">5. Compartilhamento de dados</h2>
            <p>
              Não vendemos seus dados pessoais. Podemos compartilhá-los apenas com:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Plataformas de pagamento (ex: Stripe, Hotmart, Kiwify) para processar transações</li>
              <li>Ferramentas de e-mail marketing (ex: Mailchimp) para envio de comunicações</li>
              <li>Serviços de análise (ex: Google Analytics)</li>
              <li>Autoridades públicas, quando exigido por lei</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">6. Seus direitos (LGPD)</h2>
            <p>De acordo com a LGPD, você tem direito a:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Confirmar a existência de tratamento dos seus dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação dos dados</li>
              <li>Revogar seu consentimento a qualquer momento</li>
              <li>Se opor ao tratamento dos seus dados</li>
            </ul>
            <p className="mt-3">
              Para exercer seus direitos, entre em contato:{" "}
              <strong>contato@papercraft-br.shop</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">7. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger
              seus dados contra acesso não autorizado, alteração, divulgação ou
              destruição. Todo o tráfego do site é protegido por criptografia SSL.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">8. Retenção de dados</h2>
            <p>
              Mantemos seus dados pelo tempo necessário para cumprir as
              finalidades descritas nesta política, ou pelo prazo exigido por lei
              (geralmente 5 anos para fins fiscais).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">9. Alterações nesta política</h2>
            <p>
              Podemos atualizar esta política periodicamente. A data de "última
              atualização" no topo desta página indica quando ela foi revisada.
              Recomendamos que você revise esta política regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">10. Contato</h2>
            <p>
              Dúvidas sobre esta política? Entre em contato conosco:
            </p>
            <ul className="list-none mt-2 space-y-1">
              <li>📧 <strong>contato@papercraft-br.shop</strong></li>
              <li>🌐 <strong>papercraft-br.shop</strong></li>
            </ul>
          </section>

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

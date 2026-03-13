import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Leia os Termos de Uso do Papercraft Brasil antes de adquirir nossos kits de moldes de papercraft.",
  alternates: { canonical: "https://papercraft-br.shop/termos" },
  robots: { index: true, follow: true },
};

export default function Termos() {
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
          Termos de Uso
        </h1>
        <p className="text-gray-400 text-sm mb-10">
          Última atualização: 13 de março de 2025
        </p>

        <div className="prose prose-slate max-w-none space-y-8 text-[#334155]">

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou utilizar o site <strong>papercraft-br.shop</strong> e
              adquirir qualquer produto do <strong>Papercraft Brasil</strong>,
              você concorda com estes Termos de Uso. Se não concordar com
              qualquer parte destes termos, não utilize nosso site ou serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">2. Descrição do Serviço</h2>
            <p>
              O Papercraft Brasil oferece kits digitais de moldes para construção
              de bonecos e figuras de papel em 3D (papercraft). Após a compra, o
              cliente recebe acesso digital aos arquivos de moldes para uso
              pessoal.
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Kit Iniciante:</strong> acesso a 1200 moldes com acesso vitalício</li>
              <li><strong>Kit Mestre:</strong> acesso a +3500 moldes com bônus exclusivos e acesso vitalício</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">3. Licença de Uso</h2>
            <p>
              Ao adquirir um de nossos kits, concedemos a você uma licença
              <strong> pessoal, intransferível e não exclusiva</strong> para:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Baixar e imprimir os moldes para uso pessoal</li>
              <li>Montar os bonecos para uso próprio ou como presente</li>
              <li>Compartilhar fotos das suas criações nas redes sociais</li>
            </ul>
            <p className="mt-3 font-semibold text-red-600">É expressamente proibido:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Revender, redistribuir ou compartilhar os arquivos digitais com terceiros</li>
              <li>Usar os moldes para fins comerciais sem autorização expressa</li>
              <li>Reproduzir ou publicar os moldes em outros sites ou plataformas</li>
              <li>Remover marcas d'água ou identificações de autoria dos arquivos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">4. Propriedade Intelectual</h2>
            <p>
              Todos os moldes, designs, logotipos, textos e demais conteúdos do
              site são de propriedade exclusiva do Papercraft Brasil e estão
              protegidos pela legislação brasileira de direitos autorais (Lei nº
              9.610/1998). Qualquer uso não autorizado constitui violação dos
              direitos autorais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">5. Pagamento e Acesso</h2>
            <p>
              O pagamento é processado de forma segura por plataformas parceiras.
              Após a confirmação do pagamento:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>O acesso ao kit é liberado imediatamente</li>
              <li>Um e-mail com as instruções de acesso é enviado ao endereço cadastrado</li>
              <li>O acesso é vitalício (enquanto a plataforma estiver ativa)</li>
            </ul>
            <p className="mt-3">
              Formas de pagamento aceitas: cartão de crédito, boleto bancário e Pix.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">6. Garantia e Reembolso</h2>
            <p>
              Oferecemos garantia de <strong>7 dias</strong> a partir da data de
              compra. Para solicitar reembolso, consulte nossa{" "}
              <Link href="/reembolso" className="text-[#0188FA] hover:underline">
                Política de Reembolso
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">7. Limitação de Responsabilidade</h2>
            <p>
              O Papercraft Brasil não se responsabiliza por:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Dificuldades técnicas no dispositivo do usuário para acessar os arquivos</li>
              <li>Custos de impressão ou materiais utilizados na montagem</li>
              <li>Resultados específicos na montagem dos modelos (o nível de dificuldade pode variar)</li>
              <li>Interrupções temporárias no acesso à plataforma por manutenção</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">8. Conduta do Usuário</h2>
            <p>Ao utilizar nosso site, você se compromete a não:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Usar o site para fins ilegais ou não autorizados</li>
              <li>Tentar acessar áreas restritas do sistema</li>
              <li>Transmitir vírus ou qualquer código de natureza destrutiva</li>
              <li>Violar direitos de propriedade intelectual</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">9. Modificações nos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes Termos a qualquer
              momento. As alterações entram em vigor imediatamente após a
              publicação no site. O uso continuado do site após as alterações
              constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">10. Lei Aplicável</h2>
            <p>
              Estes Termos são regidos pelas leis brasileiras. Qualquer
              controvérsia será resolvida no foro da comarca do domicílio do
              consumidor, conforme o Código de Defesa do Consumidor (Lei nº
              8.078/1990).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3">11. Contato</h2>
            <p>Dúvidas sobre estes termos? Entre em contato:</p>
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

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Preciso ter experiência com papercraft para começar?",
    answer:
      "Não! O Kit Iniciante foi criado especialmente para quem nunca fez papercraft. Os modelos começam do mais simples e vão evoluindo gradualmente. Tudo acompanha um guia passo a passo bem detalhado.",
  },
  {
    question: "Que tipo de materiais eu preciso para montar os bonecos?",
    answer:
      "Você precisa apenas de papel A4 (pode ser sulfite comum), impressora, tesoura e cola. Nada de ferramentas especiais ou gastos extras. Tudo que você já tem em casa serve!",
  },
  {
    question: "Os modelos são para imprimir ou são digitais para montar na tela?",
    answer:
      "Todos os moldes são para imprimir! Você faz o download em PDF, imprime em casa e aí é só cortar, dobrar e colar. O resultado final é um boneco físico 3D de verdade.",
  },
  {
    question: "Como recebo o acesso após a compra?",
    answer:
      "O acesso é imediato! Após a confirmação do pagamento (que acontece na hora), você recebe um e-mail com o link para acessar a plataforma. Em menos de 5 minutos você já está baixando seus moldes.",
  },
  {
    question: "O kit funciona para crianças?",
    answer:
      "Com certeza! Temos modelos para todas as idades. Para crianças menores (até 8 anos), recomendamos que um adulto ajude com a tesoura. A partir dos 10 anos a maioria consegue montar sozinha.",
  },
  {
    question: "Posso imprimir quantas vezes quiser?",
    answer:
      "Sim! Após a compra os arquivos são seus. Você pode imprimir cada modelo quantas vezes quiser — para presentear, refazer um que deu errado, ou simplesmente para ter vários iguais.",
  },
  {
    question: "Qual a diferença entre o Kit Iniciante e o Kit Mestre?",
    answer:
      "O Kit Iniciante tem 50 modelos para quem está começando, ideal para aprender as técnicas básicas. O Kit Mestre tem +1200 modelos (dos mais simples aos mais complexos), além dos 4 bônus exclusivos, videoaulas em HD, e acesso à comunidade VIP.",
  },
  {
    question: "E se eu não gostar? Tem garantia?",
    answer:
      "Sim! Oferecemos garantia incondicional de 7 dias. Se por qualquer motivo você não ficar satisfeito, basta nos enviar um e-mail dentro do prazo que devolvemos 100% do valor pago. Sem perguntas e sem complicação.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="py-20 px-4"
      id="faq"
      style={{ backgroundColor: "#FFF8F0" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#C1440E] font-semibold uppercase tracking-widest text-sm mb-2">
            Dúvidas?
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#3D2B1F]"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            Perguntas Frequentes
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-semibold text-[#3D2B1F] text-base pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-[#C1440E] transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5">
                  <div className="h-px bg-gray-100 mb-4" />
                  <p className="text-[#6B5B4F] leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Final - ultimo empurrao */}
        <div className="text-center mt-14 bg-white rounded-3xl border-2 border-gray-100 shadow-lg p-10">
          <h3
            className="text-2xl md:text-3xl font-bold text-[#3D2B1F] mb-3"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            Pronto pra começar?
          </h3>
          <p className="text-[#6B5B4F] text-base mb-6 max-w-md mx-auto">
            Comece por apenas <strong className="text-[#C1440E]">R$10</strong> ou leve o kit completo com +3500 moldes e 7 bônus por <strong className="text-[#C1440E]">R$24,90</strong>.
          </p>
          <a
            href="#pricing"
            className="inline-block text-white text-lg font-bold px-14 py-4 rounded-2xl cursor-pointer no-underline border-2 border-[#1B4332] active:translate-y-1 transition-transform mb-3"
            style={{
              fontFamily: '"Permanent Marker", cursive',
              backgroundColor: "#2D6A4F",
              boxShadow: "0 6px 0 0 #1B4332",
            }}
          >
            VER PLANOS E COMEÇAR
          </a>
          <p className="text-[#6B5B4F] text-sm">
            Garantia de 7 dias — se não gostar, devolvemos 100%.
          </p>
        </div>

        {/* Still have questions */}
        <div className="text-center mt-8">
          <p className="text-[#6B5B4F]">
            Ainda tem dúvidas? Entre em contato conosco.
          </p>
        </div>
      </div>
    </section>
  );
}

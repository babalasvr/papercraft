"use client";

import { useEffect } from "react";
import { Download, FileText, CheckCircle } from "lucide-react";

const PDF_URL = "/Kit_Impressao_Profissional.pdf";
const PDF_FILENAME = "Kit_Impressao_Profissional.pdf";

export default function KitImpressaoArquivoPage() {
  // Auto-download on page load
  useEffect(() => {
    const link = document.createElement("a");
    link.href = PDF_URL;
    link.download = PDF_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-6">
            <FileText className="w-16 h-16 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h1
          className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-3"
          style={{ fontFamily: '"Permanent Marker", cursive' }}
        >
          Seu Kit Chegou!
        </h1>
        <p className="text-[#475569] text-base mb-8 leading-relaxed">
          O download do <strong className="text-[#0F172A]">Kit Impressão Profissional</strong> já começou automaticamente.
          Se não iniciou, clique no botão abaixo.
        </p>

        {/* Download Button */}
        <a
          href={PDF_URL}
          download={PDF_FILENAME}
          className="inline-flex items-center justify-center gap-3 text-white text-lg font-bold px-10 py-4 rounded-2xl no-underline border-2 border-[#16A34A] active:translate-y-1 transition-transform mb-6"
          style={{
            fontFamily: '"Permanent Marker", cursive',
            backgroundColor: "#22C55E",
            boxShadow: "0 6px 0 0 #16A34A",
          }}
        >
          <Download className="w-5 h-5" />
          BAIXAR AGORA
        </a>

        {/* What's inside reminder */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left mt-4">
          <p className="font-bold text-[#0F172A] text-sm mb-3 text-center">O que está no kit:</p>
          <ul className="space-y-2">
            {[
              "Configurações exatas de impressora",
              "Guia de papéis e gramaturas",
              "Técnicas de corte e dobra",
              "5 erros fatais do iniciante",
              "Checklist anti-erro",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-[#475569]">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

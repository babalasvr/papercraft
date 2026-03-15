"use client";

import { CheckCircle, Mail, Lock, ArrowRight } from "lucide-react";

export default function ObrigadoPage() {
  return (
    <div className="min-h-screen grid-paper-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Polaroid card */}
        <div className="polaroid rounded-2xl">
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-8">
            {/* Success icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="font-marker text-3xl text-foreground mb-2">
                Compra Confirmada!
              </h1>
              <p className="text-muted">
                Parabéns! Seus moldes já estão disponíveis.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-dashed border-gray-200 my-6" />

            {/* Login instructions */}
            <div className="space-y-4">
              <h2 className="font-marker text-xl text-foreground text-center">
                Como acessar seus moldes:
              </h2>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 space-y-4">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-0.5">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Seu login
                    </p>
                    <p className="text-muted text-sm">
                      Use o <strong>mesmo email</strong> que você usou na compra
                    </p>
                  </div>
                </div>

                {/* Password */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-0.5">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Sua senha
                    </p>
                    <p className="text-muted text-sm">
                      A senha padrão é:{" "}
                      <code className="bg-white px-2 py-0.5 rounded border border-blue-300 font-bold text-foreground">
                        paper123
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <a
                href="/membros"
                className="cta-button w-full py-4 rounded-xl font-bold text-lg text-center flex items-center justify-center gap-2"
              >
                Acessar Meus Moldes
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            <p className="text-center text-xs text-muted mt-4">
              Guarde essas informações! Você pode acessar seus moldes a qualquer
              momento em{" "}
              <strong className="text-foreground">
                papercraft-br.shop/membros
              </strong>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-primary text-sm font-semibold hover:underline"
          >
            ← Voltar para o site
          </a>
        </div>
      </div>
    </div>
  );
}

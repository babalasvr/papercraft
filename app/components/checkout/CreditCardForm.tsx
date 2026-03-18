'use client';

import { useEffect, useRef } from 'react';

type Props = {
  amount: number; // in cents
  onSubmit: (data: { token: string; paymentMethodId: string; installments: number }) => void;
  isLoading: boolean;
};

declare global {
  interface Window {
    MercadoPago: new (publicKey: string, options?: { locale: string }) => {
      bricks: () => {
        create: (brick: string, containerId: string, settings: Record<string, unknown>) => Promise<unknown>;
      };
    };
  }
}

export default function CreditCardForm({ amount, onSubmit, isLoading }: Props) {
  const brickRef = useRef<unknown>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
    if (!publicKey) {
      console.warn('[CreditCardForm] NEXT_PUBLIC_MP_PUBLIC_KEY não configurado');
      return;
    }

    // Load MP SDK script
    const scriptId = 'mp-sdk-script';
    const existing = document.getElementById(scriptId);
    const initBrick = () => {
      if (!containerRef.current) return;
      const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' });
      const bricksBuilder = mp.bricks();

      bricksBuilder
        .create('cardPayment', 'mp-card-brick', {
          initialization: {
            amount: amount / 100,
          },
          customization: {
            visual: {
              style: {
                theme: 'dark',
                customVariables: {
                  baseColor: '#f97316',
                  fontFamily: 'inherit',
                },
              },
            },
            paymentMethods: { maxInstallments: 12 },
          },
          callbacks: {
            onReady: () => {},
            onSubmit: (cardData: {
              token: string;
              payment_method_id: string;
              installments: number;
            }) => {
              onSubmit({
                token: cardData.token,
                paymentMethodId: cardData.payment_method_id,
                installments: cardData.installments,
              });
            },
            onError: (error: unknown) => {
              console.error('[MP Brick]', error);
            },
          },
        })
        .then((brick: unknown) => {
          brickRef.current = brick;
        });
    };

    if (existing) {
      if (window.MercadoPago) initBrick();
    } else {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.onload = initBrick;
      document.head.appendChild(script);
    }
  }, [amount]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
    return (
      <div className="bg-[#0f1729] border border-gray-600 rounded-lg p-6 text-center mb-5">
        <p className="text-gray-400 text-sm">Pagamento via cartão em breve.</p>
        <p className="text-gray-500 text-xs mt-1">Por enquanto, utilize o PIX.</p>
      </div>
    );
  }

  return (
    <div className="mb-5">
      <div ref={containerRef} id="mp-card-brick" className="min-h-[300px]" />
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-3 text-gray-400 text-sm">
          <span className="animate-spin">⏳</span>
          Processando pagamento...
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, Lock } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Props = {
  clientSecret: string;
  displayAmount: string;
  onSuccess: () => void;
};

function CardForm({ displayAmount, onSuccess }: { displayAmount: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: 'if_required', // Não redireciona, a menos que 3DS seja necessário
    });

    if (result.error) {
      setError(result.error.message || 'Erro ao processar pagamento');
      setIsLoading(false);
      return;
    }

    if (result.paymentIntent?.status === 'succeeded') {
      onSuccess();
    } else {
      setError('Pagamento não foi aprovado. Tente outro cartão.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-[#0f1729] border border-gray-700 rounded-lg p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            fields: { billingDetails: { address: 'never' } },
          }}
        />
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !stripe}
        className={`w-full cta-button py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 ${
          isLoading ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pagar {displayAmount} com Cartão
          </>
        )}
      </button>

      <p className="text-center text-gray-500 text-xs flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        Pagamento 100% seguro via Stripe
      </p>
    </form>
  );
}

export default function StripePaymentForm({ clientSecret, displayAmount, onSuccess }: Props) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#f97316',
            colorBackground: '#0f1729',
            colorText: '#f3f4f6',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '8px',
          },
        },
      }}
    >
      <CardForm displayAmount={displayAmount} onSuccess={onSuccess} />
    </Elements>
  );
}

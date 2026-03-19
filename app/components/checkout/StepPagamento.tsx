'use client';

import { Loader2 } from 'lucide-react';
import OrderBumpCard from './OrderBumpCard';
import OrderBumpWhatsAppCard from './OrderBumpWhatsAppCard';
import PixQrCode from './PixQrCode';
import StripePaymentForm from './StripePaymentForm';

type PixData = {
  qrCode: string;
  qrCodeImage: string;
  displayAmount: string;
};

type StripeData = {
  clientSecret: string;
  displayAmount: string;
};

type Props = {
  orderBumpChecked: boolean;
  onOrderBumpChange: (checked: boolean) => void;
  orderBumpWhatsAppChecked: boolean;
  onOrderBumpWhatsAppChange: (checked: boolean) => void;
  onSubmitPix: () => void;
  onSubmitCard: () => void;
  isLoading: boolean;
  pixData: PixData | null;
  stripeData: StripeData | null;
  stripeReturnUrl: string;
  isActive: boolean;
  paymentTab: 'pix' | 'card';
  onPaymentTabChange: (tab: 'pix' | 'card') => void;
  onCardSuccess: () => void;
  onResetCard: () => void;
};

export default function StepPagamento({
  orderBumpChecked,
  onOrderBumpChange,
  orderBumpWhatsAppChecked,
  onOrderBumpWhatsAppChange,
  onSubmitPix,
  onSubmitCard,
  isLoading,
  pixData,
  stripeData,
  stripeReturnUrl,
  isActive,
  paymentTab,
  onPaymentTabChange,
  onCardSuccess,
  onResetCard,
}: Props) {
  if (!isActive) {
    return (
      <div className="bg-[#16213e]/50 rounded-lg p-5 border border-gray-700/30 opacity-50">
        <div className="flex items-center gap-2">
          <span className="bg-gray-600 text-gray-300 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">2</span>
          <h2 className="font-semibold text-gray-400 text-lg">Pagamento</h2>
        </div>
      </div>
    );
  }

  // Ao trocar de aba: se estava no cartão com form aberto, reseta
  const handleTabChange = (tab: 'pix' | 'card') => {
    if (tab === 'pix' && stripeData) onResetCard();
    onPaymentTabChange(tab);
  };

  return (
    <div className="bg-[#16213e] rounded-lg p-5 border border-gray-700/50">
      <div className="flex items-center gap-2 mb-5">
        <span className="bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">2</span>
        <h2 className="font-semibold text-white text-lg">Pagamento</h2>
      </div>

      {/* Order Bumps — só aparecem antes de gerar qualquer pagamento */}
      {!pixData && !stripeData && (
        <div className="mb-5 space-y-3">
          <OrderBumpCard checked={orderBumpChecked} onChange={onOrderBumpChange} />
          <OrderBumpWhatsAppCard checked={orderBumpWhatsAppChecked} onChange={onOrderBumpWhatsAppChange} />
        </div>
      )}

      {/* Abas PIX / Cartão — sempre visíveis (exceto após gerar QR do PIX) */}
      {!pixData && (
        <div className="flex rounded-lg overflow-hidden border border-gray-600 mb-5">
          <button
            onClick={() => handleTabChange('pix')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              paymentTab === 'pix'
                ? 'bg-orange-500 text-white'
                : 'bg-[#0f1729] text-gray-400 hover:text-gray-200'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.25 14.08l-3.06 3.06a3.56 3.56 0 01-5.04 0L6.09 14.08a.75.75 0 010-1.06l3.06-3.06a3.56 3.56 0 015.04 0l3.06 3.06a.75.75 0 010 1.06z" />
            </svg>
            PIX
          </button>
          <button
            onClick={() => handleTabChange('card')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              paymentTab === 'card'
                ? 'bg-orange-500 text-white'
                : 'bg-[#0f1729] text-gray-400 hover:text-gray-200'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Cartão de Crédito
          </button>
        </div>
      )}

      {/* ── ABA PIX ── */}
      {paymentTab === 'pix' && (
        pixData ? (
          <PixQrCode
            qrCode={pixData.qrCode}
            qrCodeImage={pixData.qrCodeImage}
            displayAmount={pixData.displayAmount}
          />
        ) : (
          <>
            <div className="bg-[#0f1729] border border-gray-600 rounded-lg p-4 mb-5">
              <p className="text-gray-300 text-sm">
                A confirmação é realizada em poucos minutos. Utilize o app do seu banco para pagar.
              </p>
            </div>
            <button
              onClick={onSubmitPix}
              disabled={isLoading}
              className={`w-full cta-button py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Gerando PIX...</>
              ) : (
                'Finalizar compra via PIX'
              )}
            </button>
          </>
        )
      )}

      {/* ── ABA CARTÃO ── */}
      {paymentTab === 'card' && (
        stripeData ? (
          <StripePaymentForm
            clientSecret={stripeData.clientSecret}
            displayAmount={stripeData.displayAmount}
            returnUrl={stripeReturnUrl}
            onSuccess={onCardSuccess}
          />
        ) : (
          <button
            onClick={onSubmitCard}
            disabled={isLoading}
            className={`w-full cta-button py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" />Preparando...</>
            ) : (
              'Continuar para pagamento'
            )}
          </button>
        )
      )}
    </div>
  );
}

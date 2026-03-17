'use client';

import { Loader2 } from 'lucide-react';
import OrderBumpCard from './OrderBumpCard';
import PixQrCode from './PixQrCode';

type PixData = {
  qrCode: string;
  qrCodeImage: string;
  displayAmount: string;
};

type Props = {
  paymentMethod: 'pix' | 'credit_card';
  onMethodChange: (method: 'pix' | 'credit_card') => void;
  orderBumpChecked: boolean;
  onOrderBumpChange: (checked: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
  pixData: PixData | null;
  isActive: boolean;
};

export default function StepPagamento({
  paymentMethod,
  onMethodChange,
  orderBumpChecked,
  onOrderBumpChange,
  onSubmit,
  isLoading,
  pixData,
  isActive,
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

  return (
    <div className="bg-[#16213e] rounded-lg p-5 border border-gray-700/50">
      <div className="flex items-center gap-2 mb-5">
        <span className="bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">2</span>
        <h2 className="font-semibold text-white text-lg">Pagamento</h2>
      </div>

      {/* Order Bump */}
      <div className="mb-5">
        <OrderBumpCard checked={orderBumpChecked} onChange={onOrderBumpChange} />
      </div>

      {/* PIX Data already generated - show QR */}
      {pixData ? (
        <PixQrCode
          qrCode={pixData.qrCode}
          qrCodeImage={pixData.qrCodeImage}
          displayAmount={pixData.displayAmount}
        />
      ) : (
        <>
          {/* Payment Method */}
          <p className="text-sm text-gray-300 mb-3">Escolha uma forma de pagamento</p>
          <div className="space-y-3 mb-5">
            {/* Credit Card */}
            <label
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                paymentMethod === 'credit_card'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-600 bg-[#0f1729] hover:border-gray-500'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'credit_card'}
                onChange={() => onMethodChange('credit_card')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'credit_card' ? 'border-orange-500' : 'border-gray-500'
              }`}>
                {paymentMethod === 'credit_card' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">Cartão de crédito</span>
                <div className="flex gap-1">
                  {['VISA', 'MC', 'ELO', 'HIPER'].map((brand) => (
                    <span key={brand} className="bg-gray-700 text-[10px] text-gray-300 px-1.5 py-0.5 rounded font-bold">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </label>

            {/* PIX */}
            <label
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                paymentMethod === 'pix'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-600 bg-[#0f1729] hover:border-gray-500'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'pix'}
                onChange={() => onMethodChange('pix')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'pix' ? 'border-orange-500' : 'border-gray-500'
              }`}>
                {paymentMethod === 'pix' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.25 14.08l-3.06 3.06a3.56 3.56 0 01-5.04 0L6.09 14.08a.75.75 0 010-1.06l3.06-3.06a3.56 3.56 0 015.04 0l3.06 3.06a.75.75 0 010 1.06z" />
                </svg>
                <span className="text-white font-medium text-sm">Pix</span>
              </div>
            </label>
          </div>

          {/* Credit card placeholder */}
          {paymentMethod === 'credit_card' && (
            <div className="bg-[#0f1729] border border-gray-600 rounded-lg p-6 text-center mb-5">
              <p className="text-gray-400 text-sm">
                Pagamento via cartão de crédito em breve.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Por enquanto, utilize o PIX para finalizar sua compra.
              </p>
            </div>
          )}

          {/* PIX info */}
          {paymentMethod === 'pix' && (
            <div className="bg-[#0f1729] border border-gray-600 rounded-lg p-4 mb-5">
              <p className="text-gray-300 text-sm">
                A confirmação de pagamento é realizada em poucos minutos. Utilize o aplicativo do seu banco para pagar.
              </p>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={onSubmit}
            disabled={isLoading || paymentMethod === 'credit_card'}
            className={`w-full cta-button py-4 rounded-lg font-bold text-lg text-center flex items-center justify-center gap-2 ${
              (isLoading || paymentMethod === 'credit_card') ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gerando PIX...
              </>
            ) : (
              'Finalizar compra'
            )}
          </button>
        </>
      )}
    </div>
  );
}

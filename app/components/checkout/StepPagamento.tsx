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
  orderBumpChecked: boolean;
  onOrderBumpChange: (checked: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
  pixData: PixData | null;
  isActive: boolean;
};

export default function StepPagamento({
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
          {/* PIX info */}
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.25 14.08l-3.06 3.06a3.56 3.56 0 01-5.04 0L6.09 14.08a.75.75 0 010-1.06l3.06-3.06a3.56 3.56 0 015.04 0l3.06 3.06a.75.75 0 010 1.06z" />
            </svg>
            <span className="text-white font-medium text-sm">Pagamento via PIX</span>
          </div>

          <div className="bg-[#0f1729] border border-gray-600 rounded-lg p-4 mb-5">
            <p className="text-gray-300 text-sm">
              A confirmação de pagamento é realizada em poucos minutos. Utilize o aplicativo do seu banco para pagar.
            </p>
          </div>

          <button
            onClick={onSubmit}
            disabled={isLoading}
            className={`w-full cta-button py-4 rounded-lg font-bold text-lg text-center flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
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

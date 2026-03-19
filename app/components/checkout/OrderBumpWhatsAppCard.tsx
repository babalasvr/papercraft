'use client';

import { ORDER_BUMP_WHATSAPP, formatPrice } from '@/app/lib/checkout-products';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function OrderBumpWhatsAppCard({ checked, onChange }: Props) {
  return (
    <div
      className={`rounded-lg border-2 p-4 cursor-pointer transition-all ${
        checked
          ? 'border-green-500 bg-green-500/10'
          : 'border-gray-600 bg-[#16213e] hover:border-gray-500'
      }`}
      onClick={() => onChange(!checked)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              checked
                ? 'bg-green-500 border-green-500'
                : 'border-gray-500 bg-transparent'
            }`}
          >
            {checked && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              📲 Via WhatsApp
            </span>
          </div>
          <p className="font-semibold text-white text-sm">
            {ORDER_BUMP_WHATSAPP.name}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {ORDER_BUMP_WHATSAPP.description}
          </p>
          <p className="text-green-400 font-bold mt-2">
            + {formatPrice(ORDER_BUMP_WHATSAPP.priceInCents)}
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { CheckoutProduct, ORDER_BUMP, formatPrice, calculateTotal } from '@/app/lib/checkout-products';
import TrustBadges from './TrustBadges';

type Props = {
  product: CheckoutProduct;
  orderBumps: string[];
  paymentMethod: 'pix' | 'credit_card';
  hideTrustBadges?: boolean;
};

export default function OrderSummary({ product, orderBumps, paymentMethod, hideTrustBadges }: Props) {
  const hasBump = orderBumps.includes('kit-impressao');
  const total = calculateTotal(product, orderBumps);
  const itemCount = 1 + (hasBump ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Resumo card */}
      <div className="bg-[#16213e] rounded-lg p-5 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white">
            RESUMO <span className="text-gray-400 font-normal text-sm">({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>
          </h2>
          <span className="text-orange-400 font-bold">{formatPrice(total)}</span>
        </div>

        {/* Product */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-700/50">
          <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-lg">
            🎨
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{product.name}</p>
            <p className="text-orange-400 text-sm font-semibold">{formatPrice(product.priceInCents)}</p>
          </div>
        </div>

        {/* Order bump */}
        {hasBump && (
          <div className="flex items-center gap-3 py-3 border-b border-gray-700/50">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-lg">
              🖨️
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{ORDER_BUMP.name}</p>
              <p className="text-orange-400 text-sm font-semibold">{formatPrice(ORDER_BUMP.priceInCents)}</p>
            </div>
          </div>
        )}

        {/* Totals */}
        <div className="pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-gray-300">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span className="text-white">Total</span>
            <span className="text-orange-400">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      {!hideTrustBadges && <TrustBadges />}
    </div>
  );
}

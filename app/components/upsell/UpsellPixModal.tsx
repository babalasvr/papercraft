'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Copy, Check, X } from 'lucide-react';

type Props = {
  orderId: string;
  upsellProductId: string;
  productName: string;
  onClose: () => void;
  onPaid: () => void;
};

export default function UpsellPixModal({ orderId, upsellProductId, productName, onClose, onPaid }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrCodeImage: string;
    displayAmount: string;
    externalId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate PIX on mount
  useEffect(() => {
    async function generatePix() {
      try {
        const metaEventId = crypto.randomUUID();
        const res = await fetch('/api/upsell-pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, upsellProductId, metaEventId }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Erro ao gerar PIX');
          return;
        }
        setPixData({
          qrCode: data.data.qrCode,
          qrCodeImage: data.data.qrCodeImage,
          displayAmount: data.data.displayAmount,
          externalId: data.data.externalId,
        });
      } catch {
        setError('Erro de conexão');
      } finally {
        setIsLoading(false);
      }
    }
    generatePix();
  }, [orderId, upsellProductId]);

  // Poll for payment
  useEffect(() => {
    if (!pixData) return;
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/checkout/status?external_id=${pixData.externalId}`);
        const data = await res.json();
        if (data.status === 'paid') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          onPaid();
        }
      } catch {
        // ignore
      }
    }, 3000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [pixData, onPaid]);

  const handleCopy = async () => {
    if (!pixData) return;
    try {
      await navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = pixData.qrCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className="bg-[#16213e] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="bg-orange-500 text-white text-center py-3 px-4 flex items-center justify-between">
          <span className="font-bold text-sm">Pague com PIX</span>
          <button onClick={onClose} className="text-white hover:text-orange-200">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 text-center">
          <p className="text-white font-semibold mb-1">{productName}</p>

          {isLoading && (
            <div className="py-12 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
              <p className="text-gray-400 text-sm">Gerando QR Code...</p>
            </div>
          )}

          {error && (
            <div className="py-8">
              <p className="text-red-400 text-sm">{error}</p>
              <button onClick={onClose} className="text-gray-400 text-xs underline mt-3">
                Fechar
              </button>
            </div>
          )}

          {pixData && (
            <>
              <div className="flex items-center justify-center gap-2 text-green-400 my-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                <p className="text-sm font-medium">Aguardando pagamento...</p>
              </div>

              <p className="text-2xl font-bold text-white mb-4">{pixData.displayAmount}</p>

              <div className="bg-white rounded-lg p-3 inline-block mx-auto mb-4">
                <img src={pixData.qrCodeImage} alt="QR Code PIX" className="w-40 h-40" />
              </div>

              <button
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                  copied ? 'bg-green-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {copied ? <><Check className="w-4 h-4" /> Código copiado!</> : <><Copy className="w-4 h-4" /> Copiar código PIX</>}
              </button>

              <p className="text-xs text-gray-400 mt-3">
                Abra o app do banco e pague com PIX.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

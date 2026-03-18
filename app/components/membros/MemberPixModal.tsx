'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Copy, Check, X, CheckCircle } from 'lucide-react';

type Props = {
  email: string;
  productId: string;
  productName: string;
  productPrice: string; // formatted, e.g. "R$ 19,90"
  onClose: () => void;
  onPaid: (productId: string) => void;
};

export default function MemberPixModal({
  email,
  productId,
  productName,
  productPrice,
  onClose,
  onPaid,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrCodeImage: string;
    displayAmount: string;
    externalId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handlePaid = useCallback(() => {
    setPaid(true);
    if (pollingRef.current) clearInterval(pollingRef.current);
    setTimeout(() => onPaid(productId), 2500);
  }, [onPaid, productId]);

  // Generate PIX on mount
  useEffect(() => {
    async function generatePix() {
      try {
        const res = await fetch('/api/member-pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, productId }),
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
        setError('Erro de conexão. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
    generatePix();
  }, [email, productId]);

  // Poll member-products to detect payment confirmation
  useEffect(() => {
    if (!pixData || paid) return;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/member-products?email=${encodeURIComponent(email)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        const products: string[] = data.products || [];
        if (products.includes(productId)) {
          handlePaid();
        }
      } catch {
        // ignore polling errors
      }
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [pixData, paid, email, productId, handlePaid]);

  const handleCopy = async () => {
    if (!pixData) return;
    try {
      await navigator.clipboard.writeText(pixData.qrCode);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = pixData.qrCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !paid) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        {/* Header */}
        <div
          className="text-white text-center py-4 px-4 flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, #C1440E 0%, #E85D04 100%)',
          }}
        >
          <div className="flex-1" />
          <span className="font-bold text-base flex-1 text-center">
            🔑 Pague com PIX
          </span>
          <div className="flex-1 flex justify-end">
            {!paid && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="p-6 text-center">
          {/* Payment confirmed */}
          {paid && (
            <div className="py-8 flex flex-col items-center gap-3">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <p className="text-xl font-bold text-gray-800">
                Pagamento confirmado!
              </p>
              <p className="text-gray-500 text-sm">
                Liberando seu acesso...
              </p>
            </div>
          )}

          {/* Loading */}
          {!paid && isLoading && (
            <div className="py-12 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <p className="text-gray-500 text-sm">Gerando QR Code...</p>
            </div>
          )}

          {/* Error */}
          {!paid && error && (
            <div className="py-8">
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={onClose}
                className="text-gray-400 text-xs underline"
              >
                Fechar
              </button>
            </div>
          )}

          {/* PIX data */}
          {!paid && pixData && (
            <>
              <p className="text-gray-700 font-semibold text-sm mb-1">
                {productName}
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                {pixData.displayAmount}
              </p>

              <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">
                  Aguardando pagamento...
                </span>
              </div>

              {/* QR Code */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-3 inline-block mx-auto mb-4">
                <img
                  src={pixData.qrCodeImage}
                  alt="QR Code PIX"
                  className="w-44 h-44"
                />
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all mb-3 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Código copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copiar código PIX
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 leading-relaxed">
                Abra o app do seu banco, selecione <strong>PIX</strong> e
                escaneie o QR Code ou cole o código. O acesso é liberado
                automaticamente após o pagamento.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

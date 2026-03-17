'use client';

import { useState } from 'react';
import { Copy, Check, Loader2 } from 'lucide-react';

type Props = {
  qrCode: string;
  qrCodeImage: string;
  displayAmount: string;
};

export default function PixQrCode({ qrCode, qrCodeImage, displayAmount }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = qrCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-2 text-green-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <p className="font-semibold text-sm">Aguardando pagamento...</p>
      </div>

      <p className="text-2xl font-bold text-white">{displayAmount}</p>

      {/* QR Code */}
      <div className="bg-white rounded-lg p-4 inline-block mx-auto">
        <img
          src={qrCodeImage}
          alt="QR Code PIX"
          className="w-48 h-48 mx-auto"
        />
      </div>

      {/* PIX Copy Button */}
      <button
        onClick={handleCopy}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
          copied
            ? 'bg-green-600 text-white'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Código copiado!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copiar código PIX
          </>
        )}
      </button>

      <p className="text-xs text-gray-400">
        Abra o app do seu banco, escolha pagar com PIX e cole o código acima.
        A confirmação é realizada em poucos minutos.
      </p>
    </div>
  );
}

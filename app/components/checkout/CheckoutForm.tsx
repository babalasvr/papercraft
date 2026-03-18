'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CHECKOUT_PRODUCTS, type CheckoutProduct } from '@/app/lib/checkout-products';
import { getStoredUtms, getFbc, getFbp } from '@/app/lib/utm';
import { cleanCPF, cleanPhone } from '@/app/lib/validators';
import CountdownBanner from './CountdownBanner';
import TopBanner from './TopBanner';
import StepIdentificacao, { type CustomerData } from './StepIdentificacao';
import StepPagamento from './StepPagamento';
import OrderSummary from './OrderSummary';
import TrustBadges from './TrustBadges';
import SocialProofNotification from './SocialProofNotification';

type PixData = {
  qrCode: string;
  qrCodeImage: string;
  displayAmount: string;
  externalId: string;
};

function generateEventId() {
  return crypto.randomUUID();
}

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productSlug = searchParams.get('product') || 'kit-mestre';
  const product: CheckoutProduct | undefined = CHECKOUT_PRODUCTS[productSlug];

  const [step, setStep] = useState<1 | 2>(1);
  const [customer, setCustomer] = useState<CustomerData>({
    name: '', email: '', cpf: '', phone: '',
  });
  const [orderBumps, setOrderBumps] = useState<string[]>([]);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Meta params
  const [fbc, setFbc] = useState<string | null>(null);
  const [fbp, setFbp] = useState<string | null>(null);

  useEffect(() => {
    setFbc(getFbc());
    setFbp(getFbp());
  }, []);

  // Send Meta CAPI event via our API
  const sendMetaEvent = useCallback(async (eventName: string, eventId: string, customData?: Record<string, unknown>) => {
    try {
      await fetch('/api/meta-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          eventId,
          fullName: customer.name,
          email: customer.email,
          phone: cleanPhone(customer.phone),
          cpf: cleanCPF(customer.cpf),
          fbc, fbp,
          customData,
          sourceUrl: window.location.href,
        }),
      });
    } catch (err) {
      console.error('[Meta Event]', err);
    }
  }, [customer, fbc, fbp]);

  // Fire PageView on mount
  useEffect(() => {
    if (product) {
      const eventId = generateEventId();
      sendMetaEvent('PageView', eventId);
      if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).fbq) {
        (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'PageView', {}, { eventID: eventId });
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll for payment status
  useEffect(() => {
    if (!pixData) return;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/checkout/status?external_id=${pixData.externalId}`);
        const data = await res.json();
        if (data.status === 'paid') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          router.push(`/upsell-eva?order_id=${pixData.externalId}`);
        }
      } catch {
        // Ignore polling errors
      }
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [pixData, router]);

  const handleStep1Complete = () => {
    setStep(2);
    const eventId = generateEventId();
    sendMetaEvent('InitiateCheckout', eventId, {
      value: product!.priceInCents / 100,
      currency: 'BRL',
      contentIds: [productSlug],
      contents: [{ id: productSlug, quantity: 1 }],
    });
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq(
        'track', 'InitiateCheckout',
        { value: product!.priceInCents / 100, currency: 'BRL' },
        { eventID: eventId }
      );
    }
  };

  const handleOrderBumpChange = (checked: boolean) => {
    setOrderBumps(checked ? ['kit-impressao'] : []);
  };

  const handleSubmit = async () => {
    if (!product || isLoading) return;
    setIsLoading(true);
    setError(null);

    const utms = getStoredUtms();
    const metaEventId = generateEventId();

    try {
      const res = await fetch('/api/checkout/create-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customer.name.trim(),
          email: customer.email.trim().toLowerCase(),
          cpf: cleanCPF(customer.cpf),
          phone: cleanPhone(customer.phone),
          productId: productSlug,
          orderBumps,
          utmSource: utms.utm_source,
          utmMedium: utms.utm_medium,
          utmCampaign: utms.utm_campaign,
          utmTerm: utms.utm_term,
          utmContent: utms.utm_content,
          metaEventId,
          fbc, fbp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao processar pagamento');
        setIsLoading(false);
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
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Produto não encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <TopBanner />
      <CountdownBanner minutes={10} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Step indicators - mobile */}
        <div className="flex items-center justify-center gap-4 mb-6 lg:hidden">
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-600 text-gray-300'
            }`}>1</span>
            <span className="text-sm text-gray-300">Identificação</span>
          </div>
          <div className="w-8 h-px bg-gray-600" />
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-600 text-gray-300'
            }`}>2</span>
            <span className="text-sm text-gray-300">Pagamento</span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Desktop: 3 columns / Mobile: stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_380px] gap-5">
          {/* Mobile: Summary first (sem trust badges) */}
          <div className="lg:hidden order-1">
            <OrderSummary product={product} orderBumps={orderBumps} paymentMethod="pix" hideTrustBadges />
          </div>

          {/* Step 1 */}
          <div className="order-2 lg:order-1">
            <StepIdentificacao
              customer={customer}
              onChange={setCustomer}
              onNext={handleStep1Complete}
              isCompleted={step >= 2}
              onEdit={() => setStep(1)}
            />
          </div>

          {/* Step 2 */}
          <div className="order-3 lg:order-2">
            <StepPagamento
              orderBumpChecked={orderBumps.includes('kit-impressao')}
              onOrderBumpChange={handleOrderBumpChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              pixData={pixData}
              isActive={step >= 2}
            />
          </div>

          {/* Desktop: Summary sidebar (com trust badges) */}
          <div className="hidden lg:block order-3">
            <OrderSummary product={product} orderBumps={orderBumps} paymentMethod="pix" />
          </div>
        </div>

        {/* Mobile: Trust badges no final */}
        <div className="lg:hidden mt-5">
          <TrustBadges />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-8 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-500 space-y-2">
          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">🔒 Pagamento 100% seguro</span>
            <span className="flex items-center gap-1">🛡️ Site protegido</span>
            <span className="flex items-center gap-1">💳 Diversas formas de pagamento</span>
          </div>
          <p>
            Você está em uma página de checkout segura. A responsabilidade pela oferta é do vendedor.
          </p>
          <p>&copy; {new Date().getFullYear()} Papercraft Brasil. Todos os direitos reservados.</p>
        </div>
      </footer>

      <SocialProofNotification />
    </>
  );
}

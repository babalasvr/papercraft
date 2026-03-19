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

type StripeData = {
  clientSecret: string;
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
  const [orderBumpWhatsApp, setOrderBumpWhatsApp] = useState(false);
  const [paymentTab, setPaymentTab] = useState<'pix' | 'card'>('pix');
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [stripeData, setStripeData] = useState<StripeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [fbc, setFbc] = useState<string | null>(null);
  const [fbp, setFbp] = useState<string | null>(null);

  useEffect(() => {
    setFbc(getFbc());
    setFbp(getFbp());
  }, []);

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

  useEffect(() => {
    if (product) {
      const eventId = generateEventId();
      sendMetaEvent('PageView', eventId);
      if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).fbq) {
        (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'PageView', {}, { eventID: eventId });
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll para pagamento PIX
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
      } catch { /* ignora */ }
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

  const handleOrderBumpWhatsAppChange = (checked: boolean) => {
    setOrderBumpWhatsApp(checked);
  };

  // Monta array completo de bumps para enviar à API
  const allOrderBumps = [
    ...(orderBumps),
    ...(orderBumpWhatsApp ? ['kit-whatsapp'] : []),
  ];

  // Submete pagamento PIX
  const handleSubmitPix = async () => {
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
          orderBumps: allOrderBumps,
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

  // Prepara pagamento com cartão (cria PaymentIntent)
  const handleSubmitCard = async () => {
    if (!product || isLoading) return;
    setIsLoading(true);
    setError(null);

    const utms = getStoredUtms();
    const metaEventId = generateEventId();

    try {
      const res = await fetch('/api/checkout/create-stripe-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customer.name.trim(),
          email: customer.email.trim().toLowerCase(),
          cpf: cleanCPF(customer.cpf),
          phone: cleanPhone(customer.phone),
          productId: productSlug,
          orderBumps: allOrderBumps,
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
        setError(data.error || 'Erro ao iniciar pagamento com cartão');
        return;
      }

      setStripeData({
        clientSecret: data.data.clientSecret,
        displayAmount: data.data.displayAmount,
        externalId: data.data.externalId,
      });
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cartão aprovado pelo Stripe — redireciona para upsell
  const handleCardSuccess = () => {
    if (stripeData) {
      router.push(`/upsell-eva?order_id=${stripeData.externalId}`);
    }
  };

  // Volta para PIX descartando o PaymentIntent atual
  const handleResetCard = () => {
    setStripeData(null);
    setPaymentTab('pix');
    setError(null);
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
      <CountdownBanner minutes={10} />
      <TopBanner />

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

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_380px] gap-5">
          {/* Mobile: Summary primeiro */}
          <div className="lg:hidden order-1">
            <OrderSummary product={product} orderBumps={allOrderBumps} paymentMethod="pix" hideTrustBadges />
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
              orderBumpWhatsAppChecked={orderBumpWhatsApp}
              onOrderBumpWhatsAppChange={handleOrderBumpWhatsAppChange}
              onSubmitPix={handleSubmitPix}
              onSubmitCard={handleSubmitCard}
              isLoading={isLoading}
              pixData={pixData}
              stripeData={stripeData}
              stripeReturnUrl={
                stripeData
                  ? `${typeof window !== 'undefined' ? window.location.origin : 'https://papercraft-br.shop'}/upsell-eva?order_id=${stripeData.externalId}`
                  : ''
              }
              isActive={step >= 2}
              paymentTab={paymentTab}
              onPaymentTabChange={setPaymentTab}
              onCardSuccess={handleCardSuccess}
              onResetCard={handleResetCard}
            />
          </div>

          {/* Desktop: Summary sidebar */}
          <div className="hidden lg:block order-3">
            <OrderSummary product={product} orderBumps={allOrderBumps} paymentMethod="pix" />
          </div>
        </div>

        <div className="lg:hidden mt-5">
          <TrustBadges />
        </div>
      </div>

      <footer className="border-t border-gray-800 mt-8 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-500 space-y-2">
          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">🔒 Pagamento 100% seguro</span>
            <span className="flex items-center gap-1">🛡️ Site protegido</span>
            <span className="flex items-center gap-1">💳 PIX e Cartão de Crédito</span>
          </div>
          <p>Você está em uma página de checkout segura.</p>
          <p>&copy; {new Date().getFullYear()} Papercraft Brasil. Todos os direitos reservados.</p>
        </div>
      </footer>

      <SocialProofNotification />
    </>
  );
}

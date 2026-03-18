// UTMify API — rastreamento de vendas e ROI
// Docs: https://utmify.help.center/category/112-integracoes-via-api
// Endpoint: POST https://api.utmify.com.br/api-credentials/orders

const UTMIFY_API_URL = 'https://api.utmify.com.br/api-credentials/orders';

export interface UtmifyOrderParams {
  orderId: string;
  status: 'paid' | 'waiting_payment' | 'refunded' | 'cancelled';
  email: string;
  name: string;
  phone?: string;
  cpf?: string;
  productId: string;
  productName: string;
  amountInCents: number;
  paidAt?: string;
  // UTM params (opcionais — capturados no checkout)
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
}

export async function sendUtmifyOrder(params: UtmifyOrderParams) {
  const apiToken = process.env.UTMIFY_API_TOKEN;
  if (!apiToken) {
    console.warn('[UTMify] API token não configurado — pulando evento');
    return;
  }

  const {
    orderId,
    status,
    email,
    name,
    phone,
    cpf,
    productId,
    productName,
    amountInCents,
    paidAt,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
  } = params;

  // UTMify expects amount in cents for commission fields
  // Estimate gateway fee ~2% for PIX
  const gatewayFeeInCents = Math.round(amountInCents * 0.02);
  const userCommissionInCents = amountInCents - gatewayFeeInCents;

  const payload = {
    orderId,
    platform: 'Papercraft Brasil',
    paymentMethod: 'pix',
    status,
    isTest: false,
    createdAt: paidAt || new Date().toISOString(),
    approvedDate: status === 'paid' ? (paidAt || new Date().toISOString()) : null,
    refundedAt: status === 'refunded' ? new Date().toISOString() : null,
    customer: {
      name,
      email,
      phone: phone || null,
      document: cpf || null,
      country: 'BR',
    },
    products: [
      {
        id: productId,
        name: productName,
        planId: productId,
        planName: productName,
        quantity: 1,
        priceInCents: amountInCents,
      },
    ],
    commission: {
      totalPriceInCents: amountInCents,
      gatewayFeeInCents,
      userCommissionInCents,
    },
    // UTM params — passados direto se disponíveis
    utm: {
      src: utmSource || null,
      medium: utmMedium || null,
      campaign: utmCampaign || null,
      term: utmTerm || null,
      content: utmContent || null,
    },
  };

  try {
    const response = await fetch(UTMIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': apiToken,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[UTMify] Erro ${response.status}:`, err);
      return;
    }

    const data = await response.json();
    console.log('[UTMify] Evento enviado:', orderId, '→', status);
    return data;
  } catch (error) {
    console.error('[UTMify] Falha ao enviar evento:', error);
  }
}

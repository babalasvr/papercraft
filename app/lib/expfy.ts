const EXPFY_BASE = 'https://pro.expfypay.com';

export type ExpfyPaymentResponse = {
  success: boolean;
  data: {
    transaction_id: string;
    external_id: string;
    qr_code: string;
    qr_code_image: string;
    amount: number;
    status: string;
  };
};

export async function createPixPayment(params: {
  amountInCents: number;
  description: string;
  customer: { name: string; document: string; email: string };
  externalId: string;
  callbackUrl: string;
}): Promise<ExpfyPaymentResponse> {
  const res = await fetch(`${EXPFY_BASE}/api/v1/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Public-Key': process.env.EXPFY_PUBLIC_KEY!,
      'X-Secret-Key': process.env.EXPFY_SECRET_KEY!,
    },
    body: JSON.stringify({
      amount: params.amountInCents / 100,
      description: params.description,
      customer: params.customer,
      external_id: params.externalId,
      callback_url: params.callbackUrl,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Expfy error ${res.status}: ${err}`);
  }

  return res.json();
}

export function verifyExpfySignature(rawBody: string, signature: string): boolean {
  const { createHmac, timingSafeEqual } = require('crypto');
  // Expfy assina o webhook com o mesmo secret_key usado na autenticação da API
  const secret = process.env.EXPFY_WEBHOOK_SECRET || process.env.EXPFY_SECRET_KEY!;
  const expected = createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

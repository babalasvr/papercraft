import { MercadoPagoConfig, Payment } from 'mercadopago';

export function getMercadoPagoConfig() {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error('MP_ACCESS_TOKEN não configurado');
  return new MercadoPagoConfig({ accessToken });
}

export interface CardPaymentRequest {
  token: string;
  paymentMethodId: string;
  installments: number;
  amountInCents: number;
  description: string;
  customer: {
    name: string;
    email: string;
    cpf: string;
  };
  externalReference: string;
}

export async function createCardPayment(req: CardPaymentRequest) {
  const client = getMercadoPagoConfig();
  const payment = new Payment(client);

  const response = await payment.create({
    body: {
      transaction_amount: req.amountInCents / 100,
      token: req.token,
      description: req.description,
      installments: req.installments,
      payment_method_id: req.paymentMethodId,
      payer: {
        email: req.customer.email,
        identification: { type: 'CPF', number: req.customer.cpf },
      },
      external_reference: req.externalReference,
      statement_descriptor: 'PAPERCRAFT BR',
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://papercraft-br.shop'}/api/webhook/mercadopago`,
    },
  });

  return response;
}

export async function getPayment(id: string) {
  const client = getMercadoPagoConfig();
  const payment = new Payment(client);
  return payment.get({ id: Number(id) });
}

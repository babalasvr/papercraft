export type CheckoutProduct = {
  id: string;
  name: string;
  slug: string;
  priceInCents: number;
  originalPriceInCents: number;
  plan: 'iniciante' | 'mestre';
  description: string;
  image?: string;
};

export const CHECKOUT_PRODUCTS: Record<string, CheckoutProduct> = {
  'kit-iniciante': {
    id: 'kit-iniciante',
    name: 'Kit Iniciante Papercraft',
    slug: 'kit-iniciante',
    priceInCents: 1000,
    originalPriceInCents: 7890,
    plan: 'iniciante',
    description: '1.200 moldes de papercraft',
  },
  'kit-mestre': {
    id: 'kit-mestre',
    name: 'Kit Mestre Papercraft',
    slug: 'kit-mestre',
    priceInCents: 2490,
    originalPriceInCents: 14980,
    plan: 'mestre',
    description: '+3.500 moldes de papercraft + 7 bônus',
  },
  'kit-mestre-desconto': {
    id: 'kit-mestre-desconto',
    name: 'Kit Mestre Papercraft',
    slug: 'kit-mestre-desconto',
    priceInCents: 1790,
    originalPriceInCents: 2490,
    plan: 'mestre',
    description: '+3.500 moldes de papercraft + 7 bônus',
  },
  'kit-mestre-upgrade': {
    id: 'kit-mestre-upgrade',
    name: 'Upgrade Kit Mestre Papercraft',
    slug: 'kit-mestre-upgrade',
    priceInCents: 1700,
    originalPriceInCents: 2490,
    plan: 'mestre',
    description: 'Upgrade para Kit Mestre — moldes premium desbloqueados',
  },
};

export const ORDER_BUMP = {
  id: 'kit-impressao',
  name: 'Kit Impressão Profissional',
  priceInCents: 790,
  description: 'Configurações de impressora, papéis e técnicas de corte profissional',
};

export const ORDER_BUMP_WHATSAPP = {
  id: 'kit-whatsapp',
  name: 'Material Exclusivo no WhatsApp',
  priceInCents: 490,
  description: 'Receba moldes extras e dicas avançadas direto no seu WhatsApp',
};

export function calculateTotal(
  product: CheckoutProduct,
  bumps: string[],
): number {
  let total = product.priceInCents;
  if (bumps.includes('kit-impressao')) total += ORDER_BUMP.priceInCents;
  if (bumps.includes('kit-whatsapp')) total += ORDER_BUMP_WHATSAPP.priceInCents;
  return total;
}

export function formatPrice(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

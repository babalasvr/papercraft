export type UpsellProduct = {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  driveUrl?: string;
  checkoutUrl?: string;
};

export const UPSELL_PRODUCTS: UpsellProduct[] = [
  {
    id: "pack-eva",
    name: "Pack EVA Premium",
    description: "2.500 moldes adaptados para EVA — personagens completos",
    icon: "🎨",
    price: 19.9,
    driveUrl: "/membros/pack-eva",
    checkoutUrl: "https://pay.cakto.com.br/jcpwaev",
  },
  {
    id: "metodo-lucrar",
    name: "Método Lucrar com Papercraft",
    description:
      "Curso completo para vender papercrafts e peças em EVA e lucrar até R$5.000/mês",
    icon: "💼",
    price: 47.0,
    driveUrl: "/membros/metodo-lucrar",
    checkoutUrl: "https://pay.cakto.com.br/qwygrrc",
  },
  {
    id: "calculadora-precificacao",
    name: "Calculadora de Precificação",
    description:
      "Ferramenta profissional para calcular preços de venda de papercraft e EVA",
    icon: "🧮",
    price: 27.0,
    driveUrl: "/membros/calculadora",
    checkoutUrl: "https://pay.cakto.com.br/u674tsp",
  },
  {
    id: "pack-animais",
    name: "Pack Animais Low Poly",
    description: "50 moldes dos animais mais pedidos em low poly",
    icon: "🦁",
    price: 9.9,
    driveUrl: "", // TODO: Add Google Drive link
    checkoutUrl: "https://pay.cakto.com.br/327nejh",
  },
  {
    id: "kit-impressao",
    name: "Kit Impressão Profissional",
    description:
      "Configurações de impressora, papéis certos e técnicas de corte",
    icon: "🖨️",
    price: 7.9,
    driveUrl: "/kit-impressao-arquivo",
    checkoutUrl: "https://pay.cakto.com.br/bu34t3v",
  },
];

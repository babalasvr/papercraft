import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://papercraft-br.shop";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Papercraft Brasil | Monte Bonecos Incríveis de Papel em 3D",
    template: "%s | Papercraft Brasil",
  },
  description:
    "Monte bonecos incríveis de papel em 3D com mais de 3500 moldes. Kit Iniciante por R$10 e Kit Mestre por R$24,90. Acesso vitalício, fácil de montar, sem experiência necessária!",
  keywords: [
    "papercraft",
    "papercraft brasil",
    "bonecos de papel 3D",
    "moldes papercraft",
    "paper craft",
    "origami 3D",
    "low poly papel",
    "artesanato de papel",
    "papercraft iniciante",
    "kit papercraft",
    "moldes de papel",
    "bonecos 3D papel",
    "hobby criativo",
    "papercraft superhéroes",
    "dinossauro papercraft",
  ],
  authors: [{ name: "Papercraft Brasil", url: siteUrl }],
  creator: "Papercraft Brasil",
  publisher: "Papercraft Brasil",
  alternates: {
    canonical: siteUrl,
    languages: { "pt-BR": siteUrl },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Papercraft Brasil",
    title: "Papercraft Brasil | Monte Bonecos Incríveis de Papel em 3D",
    description:
      "Monte bonecos incríveis de papel em 3D com mais de 3500 moldes. Kit Iniciante por R$10 e Kit Mestre por R$24,90. Acesso vitalício, fácil de montar!",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Papercraft Brasil – Bonecos de Papel em 3D",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Papercraft Brasil | Monte Bonecos Incríveis de Papel em 3D",
    description:
      "Monte bonecos incríveis de papel em 3D com mais de 3500 moldes. Kit Iniciante por R$10 e Kit Mestre por R$24,90.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  category: "hobby",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Papercraft Brasil",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon-512.png`,
      },
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Papercraft Brasil",
      description:
        "Monte bonecos incríveis de papel em 3D com mais de 3500 moldes aprovados.",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "pt-BR",
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "Papercraft Brasil | Monte Bonecos Incríveis de Papel em 3D",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      description:
        "Monte bonecos incríveis de papel em 3D com mais de 3500 moldes. Kit Iniciante por R$10 e Kit Mestre por R$24,90.",
      inLanguage: "pt-BR",
    },
    {
      "@type": "ItemList",
      name: "Planos Papercraft Brasil",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Product",
            name: "Kit Iniciante Papercraft",
            description:
              "Acesso a 1200 moldes de papercraft com acesso vitalício. Inclui personagens, plantas, objetos e diversos.",
            url: `${siteUrl}/#pricing`,
            image: `${siteUrl}/og-image.jpg`,
            brand: { "@type": "Brand", name: "Papercraft Brasil" },
            offers: {
              "@type": "Offer",
              priceCurrency: "BRL",
              price: "10.00",
              priceValidUntil: "2025-12-31",
              availability: "https://schema.org/InStock",
              url: `${siteUrl}/#pricing`,
            },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Product",
            name: "Kit Mestre Papercraft",
            description:
              "Acesso a +3500 moldes de papercraft com acesso vitalício. Inclui moldes gigantes 3D, alfabeto lowpoly, castelos, dinossauros, dragões e muito mais. Com 7 bônus exclusivos.",
            url: `${siteUrl}/#pricing`,
            image: `${siteUrl}/og-image.jpg`,
            brand: { "@type": "Brand", name: "Papercraft Brasil" },
            offers: {
              "@type": "Offer",
              priceCurrency: "BRL",
              price: "24.90",
              priceValidUntil: "2025-12-31",
              availability: "https://schema.org/InStock",
              url: `${siteUrl}/#pricing`,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "3000",
              bestRating: "5",
            },
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Preciso ter experiência para fazer papercraft?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Não! Os moldes do Papercraft Brasil são pensados para iniciantes. Com apenas tesoura e cola você já consegue montar bonecos incríveis.",
          },
        },
        {
          "@type": "Question",
          name: "Como acesso os moldes depois da compra?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "O acesso é imediato e vitalício. Após o pagamento você recebe o link de acesso por e-mail.",
          },
        },
        {
          "@type": "Question",
          name: "Tem garantia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim! Oferecemos garantia de 7 dias. Se não ficar satisfeito, devolvemos 100% do seu dinheiro.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}

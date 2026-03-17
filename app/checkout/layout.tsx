import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | Papercraft Brasil',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1a1a2e] text-gray-100">
      {children}
    </div>
  );
}

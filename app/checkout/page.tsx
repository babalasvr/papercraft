import { Suspense } from 'react';
import CheckoutForm from '@/app/components/checkout/CheckoutForm';

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}

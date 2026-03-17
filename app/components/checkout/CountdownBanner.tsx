'use client';

import { useState, useEffect } from 'react';

export default function CountdownBanner({ minutes = 10 }: { minutes?: number }) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  if (timeLeft <= 0) return null;

  return (
    <div className="bg-orange-500 text-white text-center py-3 px-4 font-semibold text-sm md:text-base flex items-center justify-center gap-2">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Oferta por tempo limitado!</span>
      <span className="font-mono font-bold text-lg ml-2">
        {mins}:{secs}
      </span>
    </div>
  );
}

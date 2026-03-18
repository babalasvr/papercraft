'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

const NAMES = [
  'Ana Flávia', 'Juliana', 'Mariana', 'Fernanda', 'Beatriz',
  'Camila', 'Larissa', 'Priscila', 'Renata', 'Patrícia',
  'Vanessa', 'Gabriela', 'Letícia', 'Simone', 'Débora',
  'Luciana', 'Cristina', 'Amanda', 'Carolina', 'Monique',
];

const PLANS = [
  { label: 'Kit Mestre', weight: 7 },
  { label: 'Kit Iniciante', weight: 3 },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickPlan(): string {
  const total = PLANS.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (const p of PLANS) {
    r -= p.weight;
    if (r <= 0) return p.label;
  }
  return PLANS[0].label;
}

export default function SocialProofNotification() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('');

  useEffect(() => {
    // Initial delay 8–15s, then repeat every 25–40s
    const show = () => {
      setName(pickRandom(NAMES));
      setPlan(pickPlan());
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };

    const initialDelay = 8000 + Math.random() * 7000;
    const timeout = setTimeout(() => {
      show();
      const interval = setInterval(() => {
        show();
      }, 25000 + Math.random() * 15000);
      return () => clearInterval(interval);
    }, initialDelay);

    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-4 right-4 sm:top-auto sm:bottom-6 sm:left-4 sm:right-auto z-50 flex items-center gap-3 bg-white text-gray-800 shadow-2xl rounded-xl px-4 py-3 max-w-[260px]"
      style={{ animation: 'slideInNotif 0.4s ease-out' }}
    >
      <style>{`
        @keyframes slideInNotif {
          from { transform: translateX(110%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (min-width: 640px) {
          @keyframes slideInNotif {
            from { transform: translateX(-110%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        }
      `}</style>
      <div className="bg-orange-500 text-white rounded-full p-2 shrink-0">
        <ShoppingBag className="w-4 h-4" />
      </div>
      <div className="text-xs leading-tight">
        <p className="font-bold text-gray-900">{name}</p>
        <p className="text-gray-600">acabou de comprar o</p>
        <p className="font-semibold text-orange-600">{plan}</p>
      </div>
    </div>
  );
}

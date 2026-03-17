import { ShieldCheck, RefreshCw, Zap } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: ShieldCheck,
      title: 'Pagamento 100% seguro!',
      text: 'Nossos pagamentos são realizados em ambiente protegido com total segurança para suas transações.',
      stars: 5,
    },
    {
      icon: RefreshCw,
      title: 'Reembolso e Garantia',
      text: 'Se você tiver alguma dificuldade, nós te ajudamos ou devolvemos 100% do seu dinheiro.',
      stars: 5,
    },
    {
      icon: Zap,
      title: 'Entrega 100% Segura!',
      text: 'Entregas realizadas de forma automática, chegando em menos de 1 minuto após seu pagamento.',
      stars: 5,
    },
  ];

  return (
    <div className="space-y-3">
      {badges.map((badge) => (
        <div
          key={badge.title}
          className="bg-[#16213e] rounded-lg p-4 border border-gray-700/50"
        >
          <div className="flex items-start gap-3">
            <badge.icon className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
            <div>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: badge.stars }).map((_, i) => (
                  <span key={i} className="text-orange-400 text-xs">★</span>
                ))}
              </div>
              <p className="font-semibold text-sm text-white">{badge.title}</p>
              <p className="text-xs text-gray-400 mt-1">{badge.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

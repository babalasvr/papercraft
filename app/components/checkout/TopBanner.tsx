export default function TopBanner() {
  return (
    <div className="bg-[#0f2027] border-b border-orange-500/30 text-white text-center py-2 px-4 text-xs md:text-sm flex items-center justify-center gap-4 flex-wrap">
      <span className="flex items-center gap-1.5">
        <span className="text-green-400">🔒</span>
        <span className="text-gray-300">Pagamento 100% seguro</span>
      </span>
      <span className="hidden sm:inline text-gray-600">|</span>
      <span className="flex items-center gap-1.5">
        <span>⚡</span>
        <span className="text-gray-300">Acesso imediato após pagamento</span>
      </span>
      <span className="hidden sm:inline text-gray-600">|</span>
      <span className="flex items-center gap-1.5">
        <span>🛡️</span>
        <span className="text-gray-300">Garantia de 7 dias</span>
      </span>
    </div>
  );
}

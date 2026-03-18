import Image from 'next/image';

export default function TopBanner() {
  return (
    <div className="relative w-full h-[90px] md:h-[170px]">
      <Image
        src="/img/banner.webp"
        alt="Oferta especial Papercraft Brasil"
        fill
        className="object-cover object-center"
        priority
      />
    </div>
  );
}

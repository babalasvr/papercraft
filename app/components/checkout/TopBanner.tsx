import Image from 'next/image';

export default function TopBanner() {
  return (
    <Image
      src="/img/banner.webp"
      alt="Oferta especial Papercraft Brasil"
      width={1920}
      height={400}
      className="w-full h-auto block"
      priority
    />
  );
}

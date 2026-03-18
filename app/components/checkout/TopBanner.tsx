import Image from 'next/image';

export default function TopBanner() {
  return (
    <div className="w-full">
      <Image
        src="/img/banner.webp"
        alt="Oferta especial Papercraft Brasil"
        width={1920}
        height={200}
        className="w-full h-auto object-cover"
        priority
      />
    </div>
  );
}

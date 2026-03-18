import Image from 'next/image';

export default function TopBanner() {
  return (
    <div className="w-full max-h-[120px] md:max-h-[160px] overflow-hidden">
      <Image
        src="/img/banner.webp"
        alt="Oferta especial Papercraft Brasil"
        width={1920}
        height={400}
        className="w-full h-full object-cover object-center"
        priority
      />
    </div>
  );
}

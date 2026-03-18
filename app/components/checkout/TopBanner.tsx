import Image from 'next/image';

export default function TopBanner() {
  return (
    <div className="w-full">
      <Image
        src="/img/banner.webp"
        alt="Oferta especial Papercraft Brasil"
        width={1920}
        height={400}
        className="w-full object-cover object-center block max-h-[100px] md:max-h-[160px]"
        style={{ height: 'auto' }}
        priority
      />
    </div>
  );
}

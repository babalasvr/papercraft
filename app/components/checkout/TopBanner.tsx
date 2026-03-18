import Image from 'next/image';

export default function TopBanner() {
  return (
    <div className="w-full flex justify-center">
      <Image
        src="/img/banner.webp"
        alt="Oferta especial Papercraft Brasil"
        width={1920}
        height={400}
        className="w-full h-auto block md:w-auto md:max-h-[160px]"
        priority
      />
    </div>
  );
}

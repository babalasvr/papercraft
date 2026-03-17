import BannerTopo from "@/app/components/BannerTopo";
import Hero from "@/app/components/Hero";
import Beneficios from "@/app/components/Beneficios";
import Galeria from "@/app/components/Galeria";
import Modelos from "@/app/components/Modelos";
import ComoFunciona from "@/app/components/ComoFunciona";
import Testemunhos from "@/app/components/Testemunhos";
import Bonus from "@/app/components/Bonus";
import Pricing from "@/app/components/Pricing";
import Garantia from "@/app/components/Garantia";
import FAQ from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";
import BackRedirect from "@/app/components/BackRedirect";
import UtmCapture from "@/app/components/UtmCapture";
export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      <UtmCapture />
      <BannerTopo />
      <Hero />
      <Galeria />
      <Beneficios />
      <Testemunhos />
      <ComoFunciona />
      <Modelos />
      <Bonus />
      <Pricing />
      <Garantia />
      <FAQ />
      <Footer />
      <BackRedirect />
    </main>
  );
}

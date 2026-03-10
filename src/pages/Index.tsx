import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import QuienesSomos from "@/components/landing/QuienesSomos";
import Galeria from "@/components/landing/Galeria";
import Estadisticas from "@/components/landing/Estadisticas";
import Fechas from "@/components/landing/Fechas";
import Noticias from "@/components/landing/Noticias";
import Reportajes from "@/components/landing/Reportajes";
import Tienda from "@/components/landing/Tienda";
import Contacto from "@/components/landing/Contacto";
import Footer from "@/components/landing/Footer";
import Publicidad from "@/components/landing/Publicidad";
import BannerFijo from "@/components/landing/BannerFijo";
import PopupAd from "@/components/landing/PopupAd";

const Index = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <Navbar />
    <Hero />
    <QuienesSomos />
    <Publicidad />
    <Galeria />
    <Estadisticas />
    <Fechas />
    <Noticias />
    <Reportajes />
    <Tienda />
    <Contacto />
    <Footer />
    <BannerFijo />
    <PopupAd />
  </div>
);

export default Index;

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import QuienesSomos from "@/components/landing/QuienesSomos";
import Galeria from "@/components/landing/Galeria";
import Estadisticas from "@/components/landing/Estadisticas";
import Fechas from "@/components/landing/Fechas";
import Noticias from "@/components/landing/Noticias";
import Tienda from "@/components/landing/Tienda";
import Contacto from "@/components/landing/Contacto";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <QuienesSomos />
    <Galeria />
    <Estadisticas />
    <Fechas />
    <Noticias />
    <Tienda />
    <Contacto />
    <Footer />
  </div>
);

export default Index;

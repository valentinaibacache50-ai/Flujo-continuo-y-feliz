import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Noticias from "@/components/landing/Noticias";
import Galeria from "@/components/landing/Galeria";
import Estadisticas from "@/components/landing/Estadisticas";
import Fechas from "@/components/landing/Fechas";
import Cronicas from "@/components/landing/Cronicas";
import Tienda from "@/components/landing/Tienda";
import Contacto from "@/components/landing/Contacto";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <Noticias />
    <Galeria />
    <Estadisticas />
    <Fechas />
    <Cronicas />
    <Tienda />
    <Contacto />
    <Footer />
  </div>
);

export default Index;

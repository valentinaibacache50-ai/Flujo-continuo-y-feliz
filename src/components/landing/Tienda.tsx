import { Pricing } from "@/components/ui/pricing";

const plans = [
  {
    name: "FOTOS",
    price: "8000",
    yearlyPrice: "6000",
    period: "por evento",
    features: [
      "Alta resolución",
      "Descarga digital inmediata",
      "45+ fotos por partido",
      "Retoque profesional",
      "Entrega en 24h",
    ],
    description: "Fotos profesionales de cada partido",
    buttonText: "Comprar por WhatsApp",
    href: "https://wa.me/573000000000?text=Hola!%20Quiero%20comprar%20el%20paquete%20de%20FOTOS",
    isPopular: false,
  },
  {
    name: "VIDEOS",
    price: "12000",
    yearlyPrice: "10000",
    period: "por evento",
    features: [
      "Full HD / 4K",
      "Descarga digital inmediata",
      "Highlights editados",
      "Música y gráficos",
      "Clips individuales",
      "Entrega en 48h",
      "Resumen del partido",
    ],
    description: "Videos y highlights de cada jornada",
    buttonText: "Comprar por WhatsApp",
    href: "https://wa.me/573000000000?text=Hola!%20Quiero%20comprar%20el%20paquete%20de%20VIDEOS",
    isPopular: true,
  },
  {
    name: "PACKS",
    price: "45000",
    yearlyPrice: "36000",
    period: "por evento",
    features: [
      "Todo lo de Fotos y Videos",
      "Acceso completo al torneo",
      "Contenido exclusivo",
      "Prioridad en entregas",
      "Descuentos en futuros eventos",
      "Álbum digital personalizado",
      "Soporte prioritario",
      "Archivos en la nube",
    ],
    description: "El paquete completo para toda la familia",
    buttonText: "Comprar por WhatsApp",
    href: "https://wa.me/573000000000?text=Hola!%20Quiero%20comprar%20el%20PACK%20COMPLETO",
    isPopular: false,
  },
];

const Tienda = () => {
  return (
    <section id="tienda" className="py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <Pricing
          plans={plans}
          title="📷 LLEVATE EL RECUERDO EN ALTA CALIDAD"
          description="Fotos profesionales y videos completos de los partidos de tu hijo. Descarga digital inmediata tras confirmar el pago por WhatsApp."
        />
      </div>
    </section>
  );
};

export default Tienda;

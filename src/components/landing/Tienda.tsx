import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pricing } from "@/components/ui/pricing";
import { Loader2 } from "lucide-react";

const Tienda = () => {
  const { data: productos = [], isLoading } = useQuery({
    queryKey: ["productos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("productos").select("*").order("orden", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: contacto } = useQuery({
    queryKey: ["contacto_config"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contacto_config").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  const whatsappNumber = contacto?.whatsapp?.replace(/\D/g, "") || "5491167391964";

  const plans = productos.map((p) => ({
    name: p.nombre,
    price: p.precio,
    yearlyPrice: p.precio_anual || p.precio,
    period: p.periodo,
    features: p.features || [],
    description: p.descripcion || "",
    buttonText: "Comprar por WhatsApp",
    href: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola! Quiero comprar: ${p.nombre} ($${p.precio})`)}`,
    isPopular: p.es_popular,
  }));

  if (isLoading) {
    return (
      <section id="tienda" className="py-16 md:py-28 px-4">
        <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      </section>
    );
  }

  if (plans.length === 0) return null;

  return (
    <section id="tienda" className="py-16 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <Pricing
          plans={plans}
          whatsappNumber={whatsappNumber}
          title="📷 LLEVATE EL RECUERDO EN ALTA CALIDAD"
          description="Fotos profesionales y videos completos de los partidos de tu hijo. Descarga digital inmediata tras confirmar el pago por WhatsApp."
        />
      </div>
    </section>
  );
};

export default Tienda;

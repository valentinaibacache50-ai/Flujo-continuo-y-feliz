import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

const Hero = () => {
  const { data: hero } = useQuery({
    queryKey: ["hero_config"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero_config").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  return (
    <HeroGeometric
      badge={hero?.badge ?? "PORTAL DEPORTIVO · FÚTBOL JUVENIL"}
      title1={hero?.title1 ?? "SEMILLERO"}
      title2={hero?.title2 ?? "DE CAMPEONES"}
      description={hero?.description ?? "Cobertura deportiva del fútbol juvenil y de barrio. Noticias, crónicas, estadísticas y más."}
      ctaText={hero?.cta_text ?? "Explorar contenido"}
      ctaHref={hero?.cta_href ?? "#noticias"}
    />
  );
};

export default Hero;

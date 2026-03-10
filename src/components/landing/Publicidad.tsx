import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Megaphone, ChevronRight } from "lucide-react";
import AdDetailModal from "@/components/landing/AdDetailModal";

const Publicidad = () => {
  const [selectedAd, setSelectedAd] = useState<any | null>(null);

  const { data: anuncios } = useQuery({
    queryKey: ["publicidad"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publicidad")
        .select("*")
        .eq("activo", true)
        .eq("posicion", "carrusel")
        .order("orden", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (!anuncios || anuncios.length === 0) return null;

  return (
    <>
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <Megaphone size={16} className="text-primary" />
            <p className="text-primary text-sm font-semibold tracking-wider uppercase">Sponsors</p>
          </motion.div>

          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-3 md:-ml-4">
              {anuncios.map((anuncio, i) => (
                <CarouselItem key={anuncio.id} className="pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    onClick={() => setSelectedAd(anuncio)}
                    className="relative group block w-full aspect-[16/9] rounded-xl overflow-hidden border border-border bg-muted hover:border-primary/40 transition-colors cursor-pointer"
                    aria-label={`Ver anuncio: ${anuncio.titulo}`}
                  >
                    {anuncio.imagen_url ? (
                      <img
                        src={anuncio.imagen_url}
                        alt={anuncio.titulo}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground text-sm font-medium">{anuncio.titulo}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-end justify-end p-3">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-white text-xs font-semibold bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                        Ver más <ChevronRight size={11} />
                      </span>
                    </div>
                  </motion.button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="h-9 w-9 bg-primary/80 hover:bg-primary text-primary-foreground border-none left-1 transition-all duration-200" />
            <CarouselNext className="h-9 w-9 bg-primary/80 hover:bg-primary text-primary-foreground border-none right-1 transition-all duration-200" />
          </Carousel>
        </div>
      </section>

      {selectedAd && <AdDetailModal anuncio={selectedAd} onClose={() => setSelectedAd(null)} />}
    </>
  );
};

export default Publicidad;

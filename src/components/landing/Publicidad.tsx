import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Megaphone } from "lucide-react";

const Publicidad = () => {
  const { data: anuncios } = useQuery({
    queryKey: ["publicidad"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publicidad")
        .select("*")
        .eq("activo", true)
        .order("orden", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (!anuncios || anuncios.length === 0) {
    return (
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone size={16} className="text-primary" />
            <p className="text-primary text-sm font-semibold tracking-wider uppercase">Sponsors</p>
          </div>
          <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground text-sm">Espacio para publicidad</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-6"
        >
          <Megaphone size={16} className="text-primary" />
          <p className="text-primary text-sm font-semibold tracking-wider uppercase">Sponsors</p>
        </motion.div>

        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {anuncios.map((anuncio, i) => (
              <CarouselItem key={anuncio.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <motion.a
                  href={anuncio.enlace_url || "#"}
                  target={anuncio.enlace_url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  className="block aspect-[16/9] rounded-xl overflow-hidden relative group"
                >
                  {anuncio.imagen_url ? (
                    <img
                      src={anuncio.imagen_url}
                      alt={anuncio.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-card border border-border flex items-center justify-center">
                      <span className="text-muted-foreground text-sm font-medium">{anuncio.titulo}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-foreground text-sm font-medium">{anuncio.titulo}</span>
                  </div>
                </motion.a>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="h-10 w-10 bg-primary/80 hover:bg-primary text-primary-foreground border-none left-2 transition-all duration-200" />
          <CarouselNext className="h-10 w-10 bg-primary/80 hover:bg-primary text-primary-foreground border-none right-2 transition-all duration-200" />
        </Carousel>
      </div>
    </section>
  );
};

export default Publicidad;

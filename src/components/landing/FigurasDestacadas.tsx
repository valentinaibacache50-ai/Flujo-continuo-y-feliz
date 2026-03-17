import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, X } from "lucide-react";
import SafeImage from "@/components/SafeImage";

const FigurasDestacadas = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const { data: figuras = [], isLoading } = useQuery({
    queryKey: ["figuras_destacadas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("figuras_destacadas")
        .select("*")
        .eq("activo", true)
        .order("orden", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const selectedFig = figuras.find(f => f.id === selected);

  return (
    <section id="figuras-destacadas" className="py-12 md:py-24 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <p className="text-primary text-sm font-semibold mb-1 tracking-wider uppercase">Talento en la cancha</p>
          <h2 className="font-space font-bold uppercase text-3xl md:text-5xl tracking-wide text-foreground">
            FIGURAS DESTACADAS
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : figuras.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay figuras destacadas aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {figuras.map((fig, i) => (
              <motion.div
                key={fig.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.1, 0.3) }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
              >
                {fig.imagen_url ? (
                  <div className="cursor-pointer" onClick={() => setSelected(fig.id)}>
                    <SafeImage
                      src={fig.imagen_url}
                      alt={fig.nombre}
                      className="w-full aspect-[3/4] object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[3/4] bg-secondary flex items-center justify-center">
                    <Users size={32} className="text-muted-foreground" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-space font-semibold text-foreground text-sm md:text-base line-clamp-1">{fig.nombre}</h3>
                  {(fig.posicion || fig.equipo) && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {[fig.posicion, fig.equipo].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {fig.descripcion && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{fig.descripcion}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedFig && selectedFig.imagen_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-10 right-0 z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X size={18} />
              </button>
              <img
                src={selectedFig.imagen_url}
                alt={selectedFig.nombre}
                className="w-full max-h-[85vh] object-contain rounded-xl"
              />
              <p className="text-center text-white font-space font-semibold mt-3 text-lg">{selectedFig.nombre}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FigurasDestacadas;

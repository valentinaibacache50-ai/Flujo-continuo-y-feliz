import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const BannerFijo = () => {
  const [cerrado, setCerrado] = useState(false);

  const { data: banner } = useQuery({
    queryKey: ["publicidad_banner_fijo"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publicidad")
        .select("*")
        .eq("activo", true)
        .eq("posicion", "banner_fijo")
        .order("orden", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (!banner || cerrado) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      >
        <div className="pointer-events-auto w-full max-w-5xl mx-4 mb-4 relative rounded-xl overflow-hidden shadow-2xl border border-border/50">
          <a
            href={banner.enlace_url || "#"}
            target={banner.enlace_url ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="block"
          >
            {banner.imagen_url ? (
              <img
                src={banner.imagen_url}
                alt={banner.titulo}
                className="w-full h-20 sm:h-24 object-contain bg-card"
              />
            ) : (
              <div className="w-full h-20 sm:h-24 bg-card flex items-center justify-center">
                <span className="text-foreground font-semibold">{banner.titulo}</span>
              </div>
            )}
          </a>
          <button
            onClick={() => setCerrado(true)}
            aria-label="Cerrar banner"
            className="absolute top-2 right-2 p-2 rounded-full bg-background/70 hover:bg-background text-foreground transition-colors"
          >
            <X size={16} />
          </button>
          <span className="absolute bottom-1 left-2 text-[10px] text-muted-foreground/60">
            Publicidad
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BannerFijo;

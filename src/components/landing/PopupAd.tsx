import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

const PopupAd = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { data: anuncio } = useQuery({
    queryKey: ["ad_banner", "popup"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publicidad")
        .select("*")
        .eq("activo", true)
        .eq("posicion", "popup")
        .order("orden", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!anuncio) return;
    setVisible(true);
  }, [anuncio]);

  if (!anuncio || dismissed) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          key="popup-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setDismissed(true)}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-card rounded-2xl overflow-hidden w-full max-w-sm sm:max-w-lg shadow-2xl border border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors shadow-sm"
              aria-label="Cerrar anuncio"
            >
              <X size={16} />
            </button>
            <span className="absolute top-3 left-3 z-10 text-[10px] bg-background/80 text-muted-foreground px-2 py-0.5 rounded-full">
              Publicidad
            </span>

            {anuncio.imagen_url && (
              <div className="w-full bg-card flex items-center justify-center">
                <img
                  src={anuncio.imagen_url}
                  alt={anuncio.titulo}
                  className="block w-full object-contain max-h-[60vh]"
                  loading="eager"
                  decoding="async"
                />
              </div>
            )}

            {(anuncio.enlace_url) && (
              <div className="px-5 py-4">
                {anuncio.titulo && anuncio.titulo !== "Nuevo anuncio" && anuncio.titulo !== "Publicidad" && (
                  <p className="font-semibold text-foreground text-base mb-1">{anuncio.titulo}</p>
                )}
                {anuncio.enlace_url && (
                  <a
                    href={anuncio.enlace_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all"
                  >
                    Visitar sitio <ExternalLink size={14} />
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default PopupAd;

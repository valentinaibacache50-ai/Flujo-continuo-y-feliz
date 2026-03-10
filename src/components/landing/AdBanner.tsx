import { useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ChevronRight } from "lucide-react";

const AdModal = ({ anuncio, onClose }: { anuncio: any; onClose: () => void }) => {
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.25 }}
          className="relative bg-card rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/70 hover:bg-background text-foreground transition-colors"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>

          <span className="absolute top-3 left-3 text-[10px] bg-background/70 text-muted-foreground px-2 py-0.5 rounded-full z-10">
            Publicidad
          </span>

          {anuncio.imagen_url && (
            <img
              src={anuncio.imagen_url}
              alt={anuncio.titulo}
              className="w-full object-cover max-h-72"
            />
          )}

          <div className="p-5">
            <p className="font-semibold text-foreground mb-4 text-base">{anuncio.titulo}</p>
            {anuncio.enlace_url ? (
              <a
                href={anuncio.enlace_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Visitar sitio <ExternalLink size={14} />
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">Sin enlace configurado</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

interface AdBannerProps {
  posicion: string;
  className?: string;
}

const AdBanner = ({ posicion, className = "" }: AdBannerProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: anuncio } = useQuery({
    queryKey: ["ad_banner", posicion],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publicidad")
        .select("*")
        .eq("activo", true)
        .eq("posicion", posicion)
        .order("orden", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (!anuncio) return null;

  return (
    <>
      <div className={`flex flex-col items-center my-5 ${className}`}>
        <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest mb-1.5 self-start sm:self-center">
          Sponsor
        </span>
        <button
          onClick={() => setModalOpen(true)}
          className="relative group block w-full max-w-[320px] h-[50px] sm:max-w-[728px] sm:h-[90px] rounded-lg overflow-hidden border border-border bg-primary/5 hover:border-primary/40 transition-colors cursor-pointer"
          aria-label={`Ver anuncio: ${anuncio.titulo}`}
        >
          {anuncio.imagen_url ? (
            <img
              src={anuncio.imagen_url}
              alt={anuncio.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground text-sm font-medium">{anuncio.titulo}</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              Ver más <ChevronRight size={12} />
            </span>
          </div>
        </button>
      </div>

      {modalOpen && <AdModal anuncio={anuncio} onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default AdBanner;

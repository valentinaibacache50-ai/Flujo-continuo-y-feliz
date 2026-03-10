import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

interface AdDetailModalProps {
  anuncio: { titulo: string; imagen_url: string | null; enlace_url: string | null };
  onClose: () => void;
}

const AdDetailModal = ({ anuncio, onClose }: AdDetailModalProps) => createPortal(
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
        <span className="absolute top-3 left-3 z-10 text-[10px] bg-background/70 text-muted-foreground px-2 py-0.5 rounded-full">
          Publicidad
        </span>

        {anuncio.imagen_url && (
          <div className="w-full bg-muted flex items-center justify-center">
            <img
              src={anuncio.imagen_url}
              alt={anuncio.titulo}
              className="w-full object-contain max-h-80"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        <div className="p-5">
          <p className="font-semibold text-foreground text-base mb-4">{anuncio.titulo}</p>
          {anuncio.enlace_url && (
            <a
              href={anuncio.enlace_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all"
            >
              Visitar sitio <ExternalLink size={14} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>,
  document.body
);

export default AdDetailModal;

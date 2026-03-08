import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Image, Play, Loader2, ChevronLeft, ChevronRight, X, Video } from "lucide-react";

const isVideoFile = (url: string) => /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);

const filters = ["Todo", "Fotos", "Videos"];

const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^?&\s]+)/);
  return match?.[1] || null;
};

const Lightbox = ({
  items,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  items: any[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const item = items[index];
  const videoId = item.tipo === "Video" && item.video_url ? getYouTubeId(item.video_url) : null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index < items.length - 1) onNext();
      if (e.key === "ArrowLeft" && index > 0) onPrev();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [index, items.length, onClose, onNext, onPrev]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/20 text-foreground hover:bg-background/40 transition-colors">
          <X size={24} />
        </button>

        {index > 0 && (
          <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-2 md:left-6 z-10 p-3 rounded-full bg-background/20 text-foreground hover:bg-background/40 transition-colors">
            <ChevronLeft size={28} />
          </button>
        )}

        {index < items.length - 1 && (
          <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-2 md:right-6 z-10 p-3 rounded-full bg-background/20 text-foreground hover:bg-background/40 transition-colors">
            <ChevronRight size={28} />
          </button>
        )}

        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center px-12 md:px-20"
          onClick={(e) => e.stopPropagation()}
        >
          {videoId ? (
            <div className="w-[90vw] max-w-4xl aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={item.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          ) : item.imagen_url && isVideoFile(item.imagen_url) ? (
            <video
              src={item.imagen_url}
              controls
              autoPlay
              className="max-w-[90vw] max-h-[80vh] rounded-lg"
            />
          ) : item.imagen_url ? (
            <img src={item.imagen_url} alt={item.titulo} className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg" />
          ) : (
            <div className="w-64 h-64 bg-card flex items-center justify-center rounded-lg">
              <Image size={48} className="text-muted-foreground" />
            </div>
          )}
          <div className="mt-4 text-center">
            <p className="text-foreground font-medium text-lg">{item.titulo}</p>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
              {item.tipo === "Video" && <Play size={12} />}
              {item.tipo}
            </p>
          </div>
        </motion.div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">
          {index + 1} / {items.length}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

const Galeria = () => {
  const [filter, setFilter] = useState("Todo");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["galeria"],
    queryFn: async () => {
      const { data, error } = await supabase.from("galeria").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = filter === "Todo" ? items : items.filter((i) => i.tipo === (filter === "Fotos" ? "Foto" : "Video"));

  const goNext = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null && prev < filtered.length - 1 ? prev + 1 : prev));
  }, [filtered.length]);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  const onClose = useCallback(() => setSelectedIndex(null), []);

  return (
    <section id="galeria" className="py-16 md:py-28 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="text-primary text-sm font-semibold mb-1 tracking-wider uppercase">Galería</p>
            <h2 className="font-space font-bold uppercase text-3xl md:text-5xl tracking-wide text-foreground">
              MOMENTOS CAPTURADOS
            </h2>
          </div>
        </motion.div>

        <div className="flex gap-3 mb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No hay contenido en la galería aún</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((item, i) => {
              const videoId = item.tipo === "Video" && (item as any).video_url ? getYouTubeId((item as any).video_url) : null;
              const thumbnail = item.imagen_url || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer"
                  onClick={() => setSelectedIndex(i)}
                >
                  {thumbnail ? (
                    <>
                      <img src={thumbnail} alt={item.titulo} className="w-full h-full object-cover" />
                      {item.tipo === "Video" && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-14 h-14 rounded-full bg-primary/80 flex items-center justify-center shadow-lg">
                            <Play size={24} className="text-primary-foreground ml-1" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-card border border-border flex items-center justify-center">
                      <Image size={32} className="text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <span className="text-foreground text-sm font-medium">{item.titulo}</span>
                    <span className="text-xs text-primary flex items-center gap-1">
                      {item.tipo === "Video" && <Play size={10} />}
                      {item.tipo}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {selectedIndex !== null && (
        <Lightbox items={filtered} index={selectedIndex} onClose={onClose} onNext={goNext} onPrev={goPrev} />
      )}
    </section>
  );
};

export default Galeria;

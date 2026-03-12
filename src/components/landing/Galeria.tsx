import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Image, Loader2, ChevronLeft, ChevronRight, X, AlertCircle, Camera, CalendarDays } from "lucide-react";

const formatDate = (d: string | null) => {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return null;
  }
};

const SafeImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [error, setError] = useState(false);
  if (error)
    return (
      <div className="w-full h-full bg-secondary flex items-center justify-center">
        <Image size={24} className="text-muted-foreground" />
      </div>
    );
  return (
    <img src={src} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setError(true)} />
  );
};

const AlbumLightbox = ({
  fotos,
  index,
  albumTitulo,
  onClose,
  onNext,
  onPrev,
}: {
  fotos: any[];
  index: number;
  albumTitulo: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const foto = fotos[index];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index < fotos.length - 1) onNext();
      if (e.key === "ArrowLeft" && index > 0) onPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, fotos.length, onClose, onNext, onPrev]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/96"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X size={22} />
      </button>
      <div className="absolute top-4 left-4 text-white/50 text-xs">{albumTitulo}</div>

      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-2 md:left-6 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft size={26} />
        </button>
      )}
      {index < fotos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-2 md:right-6 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight size={26} />
        </button>
      )}

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="px-12 md:px-24"
        onClick={(e) => e.stopPropagation()}
      >
        {foto?.imagen_url && (
          <img
            src={foto.imagen_url}
            alt={foto.titulo || ""}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
          />
        )}
      </motion.div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/40">
        {index + 1} / {fotos.length}
      </div>
    </motion.div>,
    document.body
  );
};

const AlbumModal = ({ album, onClose }: { album: any; onClose: () => void }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: fotos = [], isLoading } = useQuery({
    queryKey: ["album_fotos", album.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("galeria")
        .select("*")
        .eq("album_id", album.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null && prev < fotos.length - 1 ? prev + 1 : prev));
  }, [fotos.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxIndex === null) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, lightboxIndex]);

  return (
    <>
      {createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22 }}
            className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-5 border-b border-border shrink-0">
              <div>
                <h3 className="font-space font-bold uppercase text-lg text-foreground">{album.titulo}</h3>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {album.jornada && (
                    <span className="text-sm text-primary font-medium">{album.jornada}</span>
                  )}
                  {album.fecha_publicacion && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarDays size={11} />
                      {formatDate(album.fecha_publicacion)}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Camera size={11} />
                    {fotos.length} foto{fotos.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 flex-1">
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : fotos.length === 0 ? (
                <p className="text-center text-muted-foreground py-16">No hay fotos en este álbum</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {fotos.map((foto, i) => (
                    <motion.div
                      key={foto.id}
                      whileHover={{ scale: 1.04 }}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => setLightboxIndex(i)}
                    >
                      {foto.imagen_url ? (
                        <img
                          src={foto.imagen_url}
                          alt={foto.titulo || ""}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <Image size={18} className="text-muted-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}

      <AnimatePresence>
        {lightboxIndex !== null && (
          <AlbumLightbox
            fotos={fotos}
            index={lightboxIndex}
            albumTitulo={album.titulo}
            onClose={() => setLightboxIndex(null)}
            onNext={goNext}
            onPrev={goPrev}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const Galeria = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);

  const { data: albumes = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["albumes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("albumes")
        .select("*")
        .order("fecha_publicacion", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    retry: 2,
  });

  return (
    <section id="galeria" className="py-14 md:py-20 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-7"
        >
          <p className="text-primary text-sm font-semibold mb-1 tracking-wider uppercase">Galería</p>
          <h2 className="font-space font-bold uppercase text-3xl md:text-5xl tracking-wide text-foreground">
            ÁLBUMES
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Error al cargar la galería</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90"
            >
              Reintentar
            </button>
          </div>
        ) : albumes.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No hay álbumes aún</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {albumes.map((album, i) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.2) }}
                whileHover={{ scale: 1.03 }}
                className="rounded-xl overflow-hidden cursor-pointer border border-border hover:border-primary/50 transition-colors bg-card"
                onClick={() => setSelectedAlbum(album)}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  {album.miniatura_url ? (
                    <SafeImage
                      src={album.miniatura_url}
                      alt={album.titulo}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <Camera size={22} className="text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="px-3 py-2">
                  <p className="text-foreground text-sm font-semibold line-clamp-1">{album.titulo}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {album.jornada && (
                      <span className="text-xs text-primary font-medium truncate">{album.jornada}</span>
                    )}
                    {album.fecha_publicacion && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(album.fecha_publicacion)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedAlbum && (
          <AlbumModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Galeria;

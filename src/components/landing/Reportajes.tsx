import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mic, X, Play, AlertCircle, ExternalLink } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import VideoThumbnail from "@/components/VideoThumbnail";
import AdBanner from "@/components/landing/AdBanner";
import { getYoutubeId, isDirectVideoFile } from "@/lib/video-utils";

const formatDate = (d: string | null) => {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return null;
  }
};

const SafeVideo = ({ src, className, controls, autoPlay }: { src: string; className?: string; controls?: boolean; autoPlay?: boolean }) => {
  const [error, setError] = useState(false);
  if (error)
    return (
      <div className={`bg-secondary flex items-center justify-center ${className}`}>
        <Play size={32} className="text-muted-foreground" />
      </div>
    );
  return <video src={src} className={className} controls={controls} autoPlay={autoPlay} muted playsInline controlsList="nodownload" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} onError={() => setError(true)} />;
};

const ReportajeLightbox = ({ item, onClose }: { item: any; onClose: () => void }) => {
  const youtubeId = getYoutubeId(item.video_url);
  const isDirectVideo = item.imagen_url && isDirectVideoFile(item.imagen_url);
  const dateStr = formatDate(item.fecha_publicacion);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/20 text-foreground hover:bg-background/40 transition-colors"
        >
          <X size={24} />
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl w-full bg-card rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {youtubeId ? (
            <div className="w-full aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title={item.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : isDirectVideo ? (
            <SafeVideo src={item.imagen_url} controls autoPlay className="w-full max-h-[50vh] object-contain bg-black" />
          ) : item.imagen_url ? (
            <SafeImage src={item.imagen_url} alt={item.titulo} className="w-full max-h-[50vh] object-contain bg-black" />
          ) : null}

          <div className="p-6 md:p-8">
            <AdBanner posicion="video-bajo-reproductor" className="mt-0 mb-6" />

            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block text-xs font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-full tracking-wider">{item.tag}</span>
              {dateStr && <span className="text-xs text-muted-foreground">{dateStr}</span>}
            </div>

            <h3 className="font-space font-bold text-xl md:text-2xl text-foreground mb-1">{item.titulo}</h3>
            {item.subtitulo && <p className="text-muted-foreground text-sm mb-4">{item.subtitulo}</p>}
            <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-line">{item.contenido}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

const Reportajes = () => {
  const [selected, setSelected] = useState<any | null>(null);

  const { data: reportajes = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["reportajes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reportajes")
        .select("*")
        .eq("publicado", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    retry: 2,
  });

  const closeLightbox = useCallback(() => setSelected(null), []);

  return (
    <section id="reportajes" className="py-12 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <p className="text-primary text-sm font-semibold mb-1 tracking-wider uppercase">Reportajes</p>
          <h2 className="font-space font-bold uppercase text-3xl md:text-5xl tracking-wide text-foreground">NOTAS Y ENTREVISTAS</h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : isError ? (
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Error al cargar los reportajes</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">Reintentar</button>
          </div>
        ) : reportajes.length === 0 ? (
          <div className="text-center py-16">
            <Mic className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay reportajes publicados aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {reportajes.map((r, i) => {
              const isDirect = r.imagen_url && isDirectVideoFile(r.imagen_url);
              const youtubeId = getYoutubeId(r.video_url);
              const thumbnail = !isDirect
                ? (r.imagen_url || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null))
                : null;
              const dateStr = formatDate(r.fecha_publicacion);
              const hasVideo = isDirect || !!youtubeId;

              return (
                <motion.article
                  key={r.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.1, 0.3) }}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer group"
                  onClick={() => setSelected(r)}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {isDirect ? (
                      <VideoThumbnail
                        src={r.imagen_url!}
                        alt={r.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : thumbnail ? (
                      <SafeImage
                        src={thumbnail}
                        alt={r.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <Mic size={32} className="text-muted-foreground" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {hasVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                          <Play size={22} className="text-primary-foreground ml-1" />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        {hasVideo ? "Ver video" : "Ver nota"} <ExternalLink size={10} />
                      </span>
                    </div>
                  </div>

                  <div className="p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block text-[10px] font-semibold text-primary-foreground bg-primary/80 px-2.5 py-0.5 rounded-full tracking-wider">{r.tag}</span>
                      {dateStr && <span className="text-[10px] text-muted-foreground">{dateStr}</span>}
                    </div>
                    <h3 className="font-space font-semibold text-base mb-1 text-foreground group-hover:text-primary transition-colors leading-snug">{r.titulo}</h3>
                    {r.subtitulo && <p className="text-muted-foreground text-xs mb-2">{r.subtitulo}</p>}
                    <p className="text-muted-foreground text-sm line-clamp-2">{r.contenido}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {selected && <ReportajeLightbox item={selected} onClose={closeLightbox} />}
    </section>
  );
};

export default Reportajes;

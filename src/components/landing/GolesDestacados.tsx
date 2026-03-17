import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Play, X, Goal } from "lucide-react";
import { getYoutubeId, getYoutubeThumbnail, getYoutubeEmbedUrl, isDirectVideoFile } from "@/lib/video-utils";
import VideoThumbnail from "@/components/VideoThumbnail";

const GolesDestacados = () => {
  const [playing, setPlaying] = useState<string | null>(null);

  const { data: goles = [], isLoading } = useQuery({
    queryKey: ["goles_destacados"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goles_destacados")
        .select("*")
        .eq("activo", true)
        .order("orden", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const getThumbnail = (item: typeof goles[number]) => {
    if (item.miniatura_url) return item.miniatura_url;
    const ytThumb = getYoutubeThumbnail(item.video_url);
    if (ytThumb) return ytThumb;
    return null;
  };

  return (
    <section id="goles-destacados" className="py-12 md:py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <p className="text-primary text-sm font-semibold mb-1 tracking-wider uppercase">Lo mejor de la cancha</p>
          <h2 className="font-space font-bold uppercase text-3xl md:text-5xl tracking-wide text-foreground">
            GOLES DESTACADOS
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : goles.length === 0 ? (
          <div className="text-center py-16">
            <Goal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay goles destacados aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {goles.map((gol, i) => {
              const thumb = getThumbnail(gol);
              const ytId = getYoutubeId(gol.video_url);
              return (
                <motion.div
                  key={gol.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.1, 0.3) }}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
                >
                  <div
                    className="relative aspect-video cursor-pointer"
                    onClick={() => setPlaying(gol.id)}
                  >
                    {thumb ? (
                      <img src={thumb} alt={gol.titulo} className="w-full h-full object-cover" loading="lazy" />
                    ) : isDirectVideoFile(gol.video_url) ? (
                      <VideoThumbnail src={gol.video_url} alt={gol.titulo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <Play size={32} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play size={24} className="text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-space font-semibold text-foreground line-clamp-2">{gol.titulo}</h3>
                    {gol.descripcion && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{gol.descripcion}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video player modal */}
      <AnimatePresence>
        {playing && (() => {
          const gol = goles.find(g => g.id === playing);
          if (!gol) return null;
          const ytEmbed = getYoutubeEmbedUrl(gol.video_url);
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              onClick={() => setPlaying(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setPlaying(null)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                >
                  <X size={18} />
                </button>
                {ytEmbed ? (
                  <iframe
                    src={ytEmbed}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={gol.video_url}
                    className="w-full h-full"
                    controls
                    autoPlay
                    controlsList="nodownload"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
};

export default GolesDestacados;

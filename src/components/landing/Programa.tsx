import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tv, Play, Clock, Calendar } from "lucide-react";

const getYoutubeId = (url: string): string | null => {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
};

const getThumb = (ep: any) => {
  if (ep.miniatura_url) return ep.miniatura_url;
  const ytId = getYoutubeId(ep.video_url);
  return ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
};

const getEmbedUrl = (url: string) => {
  const ytId = getYoutubeId(url);
  return ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1` : url;
};

const Programa = () => {
  const [activeEp, setActiveEp] = useState<any | null>(null);

  const { data: episodios = [], isLoading } = useQuery({
    queryKey: ["programa_episodios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programa_episodios")
        .select("*")
        .eq("activo", true)
        .order("temporada", { ascending: false })
        .order("episodio", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading || episodios.length === 0) return null;

  const featured = activeEp ?? episodios[0];
  const others = episodios.filter((e) => e.id !== featured.id);

  return (
    <section id="programa" className="py-12 md:py-16 px-5 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <Tv size={18} className="text-primary" />
            <p className="text-primary text-sm font-semibold tracking-wider uppercase">
              Programa
            </p>
          </div>
          <h2 className="font-space font-bold text-2xl md:text-3xl text-foreground text-center">
            Semillero de Campeones TV
          </h2>
          <p className="text-muted-foreground text-sm text-center max-w-lg">
            Mirá los episodios completos de nuestro programa deportivo
          </p>
        </div>

        {/* Featured player */}
        <div className="mb-8">
          <div className="relative w-full rounded-xl overflow-hidden border border-border bg-black" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={getEmbedUrl(featured.video_url)}
              title={featured.titulo}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                T{featured.temporada} · E{featured.episodio}
              </span>
              {featured.duracion && featured.duracion !== "00:00" && (
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Clock size={12} /> {featured.duracion}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-foreground text-lg">{featured.titulo}</h3>
          </div>
          {featured.descripcion && (
            <p className="text-muted-foreground text-sm mt-1">{featured.descripcion}</p>
          )}
        </div>

        {/* Episode grid */}
        {others.length > 0 && (
          <>
            <h4 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-4">
              Más episodios
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {others.map((ep) => {
                const thumb = getThumb(ep);
                return (
                  <button
                    key={ep.id}
                    onClick={() => { setActiveEp(ep); window.scrollTo({ top: document.getElementById("programa")?.offsetTop ?? 0, behavior: "smooth" }); }}
                    className="group text-left rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors bg-card"
                  >
                    <div className="relative" style={{ paddingBottom: "56.25%" }}>
                      {thumb ? (
                        <img src={thumb} alt={ep.titulo} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                          <Play size={24} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play size={16} className="text-primary-foreground ml-0.5" />
                        </div>
                      </div>
                      {ep.duracion && ep.duracion !== "00:00" && (
                        <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                          {ep.duracion}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-foreground text-sm font-medium line-clamp-2">{ep.titulo}</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        T{ep.temporada} · Episodio {ep.episodio}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Programa;

import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tv, Play, Clock } from "lucide-react";
import VideoThumbnail from "@/components/VideoThumbnail";

import { getYoutubeEmbedUrl, getYoutubeThumbnail, isDirectVideoFile, getYoutubeId } from "@/lib/video-utils";

const getThumb = (ep: any) => ep.miniatura_url || getYoutubeThumbnail(ep.video_url);

const isDirectVideo = (url?: string | null) => isDirectVideoFile(url);

/* ── Track view events ───────────────────────────────────────────────── */

const trackView = async (id: string, type: "start" | "half" | "complete") => {
  try {
    await supabase.rpc("increment_programa_view" as any, { ep_id: id, view_type: type });
  } catch { /* silent */ }
};

/* ── YouTube IFrame API loader ───────────────────────────────────────── */

let ytApiReady: Promise<void> | null = null;

const loadYTApi = (): Promise<void> => {
  if (ytApiReady) return ytApiReady;
  ytApiReady = new Promise<void>((resolve) => {
    if ((window as any).YT?.Player) { resolve(); return; }
    const prev = (window as any).onYouTubeIframeAPIReady;
    (window as any).onYouTubeIframeAPIReady = () => { prev?.(); resolve(); };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
  return ytApiReady;
};

/* ── YouTube Player with tracking ────────────────────────────────────── */

const YouTubePlayer = ({ videoId, episodeId, title }: { videoId: string; episodeId: string; title: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const trackedStart = useRef(false);
  const trackedHalf = useRef(false);
  const trackedComplete = useRef(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await loadYTApi();
      if (!mounted || !containerRef.current) return;

      // Create a child div for YT to replace
      const el = document.createElement("div");
      containerRef.current.appendChild(el);

      playerRef.current = new (window as any).YT.Player(el, {
        videoId,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (event: any) => {
            const YT = (window as any).YT;
            if (event.data === YT.PlayerState.PLAYING) {
              if (!trackedStart.current) {
                trackedStart.current = true;
                trackView(episodeId, "start");
              }
              // Poll progress every 3s
              clearInterval(intervalRef.current);
              intervalRef.current = setInterval(() => {
                const p = playerRef.current;
                if (!p?.getCurrentTime || !p?.getDuration) return;
                const pct = p.getCurrentTime() / p.getDuration();
                if (pct >= 0.5 && !trackedHalf.current) {
                  trackedHalf.current = true;
                  trackView(episodeId, "half");
                }
                if (pct >= 0.90 && !trackedComplete.current) {
                  trackedComplete.current = true;
                  trackView(episodeId, "complete");
                }
              }, 3000);
            } else {
              clearInterval(intervalRef.current);
            }
            if (event.data === YT.PlayerState.ENDED && !trackedComplete.current) {
              trackedComplete.current = true;
              trackView(episodeId, "complete");
            }
          },
        },
      });
    };

    init();

    return () => {
      mounted = false;
      clearInterval(intervalRef.current);
      playerRef.current?.destroy?.();
    };
  }, [videoId, episodeId]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-black" style={{ paddingBottom: "56.25%" }}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full [&>div]:w-full [&>div]:h-full [&>iframe]:w-full [&>iframe]:h-full" />
    </div>
  );
};

/* ── Featured Player with click-to-play ──────────────────────────────── */

const FeaturedPlayer = ({ episode }: { episode: any }) => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackedStart = useRef(false);
  const trackedHalf = useRef(false);
  const trackedComplete = useRef(false);

  // Reset when episode changes
  useEffect(() => {
    setPlaying(false);
    trackedStart.current = false;
    trackedHalf.current = false;
    trackedComplete.current = false;
  }, [episode.id]);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const pct = v.currentTime / v.duration;
    if (pct >= 0.5 && !trackedHalf.current) {
      trackedHalf.current = true;
      trackView(episode.id, "half");
    }
    if (pct >= 0.90 && !trackedComplete.current) {
      trackedComplete.current = true;
      trackView(episode.id, "complete");
    }
  }, [episode.id]);

  const handlePlay = useCallback(() => {
    if (!trackedStart.current) {
      trackedStart.current = true;
      trackView(episode.id, "start");
    }
  }, [episode.id]);

  const videoUrl = episode.video_url?.trim() ?? "";
  const thumb = getThumb(episode);
  const direct = isDirectVideo(videoUrl);
  const ytId = getYoutubeId(videoUrl);
  const embedUrl = getYoutubeEmbedUrl(videoUrl);
  const canPlay = Boolean(videoUrl) && (direct || Boolean(embedUrl));

  if (!playing) {
    return (
      <div
        className={`relative w-full rounded-xl overflow-hidden border border-border bg-black ${canPlay ? "cursor-pointer group" : "cursor-default"}`}
        style={{ paddingBottom: "56.25%" }}
        onClick={() => canPlay && setPlaying(true)}
        role={canPlay ? "button" : undefined}
        aria-label={canPlay ? `Reproducir ${episode.titulo}` : undefined}
      >
        {thumb ? (
          <img src={thumb} alt={episode.titulo} className="absolute inset-0 w-full h-full object-cover" />
        ) : direct ? (
          <VideoThumbnail src={videoUrl} alt={episode.titulo} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}

        <div
          className={`absolute inset-0 transition-colors flex items-center justify-center ${
            canPlay ? "bg-black/30 group-hover:bg-black/40" : "bg-black/55"
          }`}
        >
          {canPlay ? (
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Play size={28} className="text-primary-foreground ml-1" />
            </div>
          ) : (
            <p className="text-primary-foreground text-sm font-medium px-4 text-center">
              Este programa todavía no tiene un video cargado.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!canPlay) {
    return (
      <div className="relative w-full rounded-xl overflow-hidden border border-border bg-card px-5 py-8 text-center">
        <p className="text-foreground font-semibold">No hay un video válido para reproducir.</p>
        <p className="text-muted-foreground text-sm mt-1">Cargá una URL de YouTube o un archivo .mp4/.webm/.mov desde el panel admin.</p>
      </div>
    );
  }

  if (direct) {
    return (
      <div className="relative w-full rounded-xl overflow-hidden border border-border bg-black" style={{ paddingBottom: "56.25%" }}>
        <video
          ref={videoRef}
          key={episode.id}
          src={videoUrl}
          controls
          autoPlay
          onPlay={handlePlay}
          onTimeUpdate={handleTimeUpdate}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  // YouTube: use IFrame API for accurate tracking
  return <YouTubePlayer videoId={ytId!} episodeId={episode.id} title={episode.titulo} />;
};

/* ── Main Component ──────────────────────────────────────────────────── */

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
      // Filter out episodes with empty/invalid video_url so they never show broken players
      return (data ?? []).filter((ep) => {
        const url = ep.video_url?.trim();
        return url && (isDirectVideo(url) || !!getYoutubeEmbedUrl(url));
      });
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
            <p className="text-primary text-sm font-semibold tracking-wider uppercase">Programa</p>
          </div>
          <h2 className="font-space font-bold text-2xl md:text-3xl text-foreground text-center">
            Semillero de Campeones TV
          </h2>
          <p className="text-muted-foreground text-sm text-center max-w-lg">
            Mirá las transmisiones completas de nuestro programa deportivo
          </p>
        </div>

        {/* Featured player */}
        <div className="mb-8">
          <FeaturedPlayer episode={featured} />
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                T{featured.temporada} · P{featured.episodio}
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
              Más transmisiones
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {others.map((ep) => {
                const thumb = getThumb(ep);
                const direct = isDirectVideo(ep.video_url);
                return (
                  <button
                    key={ep.id}
                    onClick={() => { setActiveEp(ep); window.scrollTo({ top: document.getElementById("programa")?.offsetTop ?? 0, behavior: "smooth" }); }}
                    className="group text-left rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors bg-card"
                  >
                    <div className="relative" style={{ paddingBottom: "56.25%" }}>
                      {thumb ? (
                        <img src={thumb} alt={ep.titulo} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                      ) : direct ? (
                        <VideoThumbnail src={ep.video_url} alt={ep.titulo} className="absolute inset-0 w-full h-full object-cover" />
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
                        T{ep.temporada} · Programa {ep.episodio}
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

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone, ChevronRight } from "lucide-react";
import AdDetailModal from "@/components/landing/AdDetailModal";

const Publicidad = () => {
  const [selectedAd, setSelectedAd] = useState<any | null>(null);

  const { data: anuncios = [] } = useQuery({
    queryKey: ["publicidad"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publicidad")
        .select("*")
        .eq("activo", true)
        .eq("posicion", "carrusel")
        .order("orden", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (anuncios.length === 0) return null;

  return (
    <>
      <section className="py-8 md:py-12 px-5 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Megaphone size={16} className="text-primary" />
            <p className="text-primary text-sm font-semibold tracking-wider uppercase">
              Sponsors
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:items-stretch md:gap-5">
            {anuncios.map((anuncio) => (
              <div
                key={anuncio.id}
                className="w-full max-w-sm sm:flex-1 sm:min-w-[260px] sm:max-w-[480px]"
              >
                <div
                  onClick={() => setSelectedAd(anuncio)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedAd(anuncio)}
                  aria-label={`Ver anuncio: ${anuncio.titulo}`}
                  className="w-full rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-colors cursor-pointer group"
                  style={{ position: "relative", aspectRatio: "16/9", background: "#ffffff" }}
                >
                  {anuncio.imagen_url ? (
                    <img
                      src={anuncio.imagen_url}
                      alt={anuncio.titulo}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      loading="eager"
                    />
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 1rem",
                      }}
                    >
                      <span className="text-muted-foreground text-sm font-medium text-center">
                        {anuncio.titulo}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-end p-3">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-white text-xs font-semibold bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      Ver más <ChevronRight size={11} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedAd && (
        <AdDetailModal anuncio={selectedAd} onClose={() => setSelectedAd(null)} />
      )}
    </>
  );
};

export default Publicidad;

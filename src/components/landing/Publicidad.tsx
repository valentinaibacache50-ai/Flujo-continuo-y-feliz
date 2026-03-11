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
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Megaphone size={16} className="text-primary" />
            <p className="text-primary text-sm font-semibold tracking-wider uppercase">
              Sponsors
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {anuncios.map((anuncio) => (
              <button
                key={anuncio.id}
                onClick={() => setSelectedAd(anuncio)}
                className="relative group flex items-center justify-center w-full aspect-video rounded-xl overflow-hidden border border-border bg-muted hover:border-primary/40 transition-colors cursor-pointer"
                aria-label={`Ver anuncio: ${anuncio.titulo}`}
              >
                {anuncio.imagen_url ? (
                  <img
                    src={anuncio.imagen_url}
                    alt={anuncio.titulo}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center px-4">
                    <span className="text-muted-foreground text-sm font-medium text-center">
                      {anuncio.titulo}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-end justify-end p-3">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-white text-xs font-semibold bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    Ver más <ChevronRight size={11} />
                  </span>
                </div>
              </button>
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

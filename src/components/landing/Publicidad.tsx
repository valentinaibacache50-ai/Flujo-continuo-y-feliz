import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone, ChevronRight } from "lucide-react";
import AdDetailModal from "@/components/landing/AdDetailModal";

const AdCard = ({ anuncio, onClick }: { anuncio: any; onClick: () => void }) => (
  <div
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
    aria-label={`Ver anuncio: ${anuncio.titulo}`}
    className="relative w-full rounded-xl overflow-hidden border border-border hover:border-primary/50 cursor-pointer transition-colors group aspect-video"
  >
    {anuncio.imagen_url ? (
      <img
        src={anuncio.imagen_url}
        alt={anuncio.titulo}
        className="absolute inset-0 w-full h-full object-contain bg-card"
        loading="eager"
        decoding="async"
      />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center px-4 bg-secondary">
        <span className="text-muted-foreground text-sm font-medium text-center">{anuncio.titulo}</span>
      </div>
    )}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-end p-3 pointer-events-none">
      <span className="flex items-center gap-1 text-white text-xs font-semibold bg-black/50 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        Ver más <ChevronRight size={11} />
      </span>
    </div>
  </div>
);

const Publicidad = () => {
  const [selectedAd, setSelectedAd] = useState<any | null>(null);

  const { data: anuncios = [] } = useQuery({
    queryKey: ["publicidad_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publicidad")
        .select("*")
        .eq("activo", true)
        .order("orden", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Show all active ads (both carrusel and popup) in the section
  if (anuncios.length === 0) return null;

  return (
    <>
      <section className="py-8 md:py-12 px-5 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Megaphone size={16} className="text-primary" />
            <p className="text-primary text-sm font-semibold tracking-wider uppercase">Sponsors</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {anuncios.map((anuncio) => (
              <AdCard key={anuncio.id} anuncio={anuncio} onClick={() => setSelectedAd(anuncio)} />
            ))}
          </div>
        </div>
      </section>
      {selectedAd && <AdDetailModal anuncio={selectedAd} onClose={() => setSelectedAd(null)} />}
    </>
  );
};

export default Publicidad;

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight } from "lucide-react";
import AdDetailModal from "@/components/landing/AdDetailModal";

interface AdBannerProps {
  posicion: string;
  className?: string;
}

const AdBanner = ({ posicion, className = "" }: AdBannerProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: anuncio } = useQuery({
    queryKey: ["ad_banner", posicion],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publicidad")
        .select("*")
        .eq("activo", true)
        .eq("posicion", posicion)
        .order("orden", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (!anuncio) return null;

  return (
    <>
      <div className={`flex flex-col items-center my-5 ${className}`}>
        <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest mb-1.5 self-start sm:self-center">
          Sponsor
        </span>
        <button
          onClick={() => setModalOpen(true)}
          className="relative group block w-full max-w-[320px] h-[50px] sm:max-w-[728px] sm:h-[90px] rounded-lg overflow-hidden border border-border bg-card hover:border-primary/40 transition-colors cursor-pointer"
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
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground text-sm font-medium">{anuncio.titulo}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              Ver más <ChevronRight size={12} />
            </span>
          </div>
        </button>
      </div>

      {modalOpen && <AdDetailModal anuncio={anuncio} onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default AdBanner;

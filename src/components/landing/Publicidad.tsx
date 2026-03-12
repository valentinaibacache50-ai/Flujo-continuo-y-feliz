import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone, ChevronRight } from "lucide-react";
import AdDetailModal from "@/components/landing/AdDetailModal";

const AdCard = ({ anuncio, onClick }: { anuncio: any; onClick: () => void }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`Ver anuncio: ${anuncio.titulo}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%",
        borderRadius: "0.75rem",
        overflow: "hidden",
        border: hovered ? "1px solid rgba(var(--primary), 0.4)" : "1px solid rgba(255,255,255,0.1)",
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}
    >
      {anuncio.imagen_url ? (
        <img
          src={anuncio.imagen_url}
          alt={anuncio.titulo}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          loading="eager"
        />
      ) : (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 1rem",
          }}
        >
          <span style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", fontWeight: 500, textAlign: "center" }}>
            {anuncio.titulo}
          </span>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: hovered ? "rgba(0,0,0,0.2)" : "transparent",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          padding: "0.75rem",
          transition: "background 0.2s",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            color: "white",
            fontSize: "0.75rem",
            fontWeight: 600,
            background: "rgba(0,0,0,0.5)",
            padding: "0.25rem 0.625rem",
            borderRadius: "9999px",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        >
          Ver más <ChevronRight size={11} />
        </span>
      </div>
    </div>
  );
};

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
              Publicidad
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:items-stretch md:gap-5">
            {anuncios.map((anuncio) => (
              <div
                key={anuncio.id}
                className="w-full max-w-sm sm:flex-1 sm:min-w-[260px] sm:max-w-[480px]"
              >
                <AdCard anuncio={anuncio} onClick={() => setSelectedAd(anuncio)} />
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

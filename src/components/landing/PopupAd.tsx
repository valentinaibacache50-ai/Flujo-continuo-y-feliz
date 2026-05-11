import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X, ExternalLink } from "lucide-react";

const PopupAd = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { data: anuncio } = useQuery({
    queryKey: ["ad_popup"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publicidad")
        .select("*")
        .eq("activo", true)
        .eq("posicion", "popup")
        .order("orden", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!anuncio || dismissed) return;
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, [anuncio, dismissed]);

  if (!anuncio || dismissed || !visible) return null;

  return createPortal(
    <div
      className="fixed inset-x-0 top-16 bottom-0 z-[40] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
      onClick={() => setDismissed(true)}
    >
      <div
        className="relative bg-card rounded-2xl overflow-hidden w-full max-w-[92vw] sm:max-w-md md:max-w-lg my-auto shadow-2xl border border-border/50 animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors shadow-sm"
          aria-label="Cerrar anuncio"
        >
          <X size={16} />
        </button>
        <span className="absolute top-3 left-3 z-10 text-[10px] bg-background/80 text-muted-foreground px-2 py-0.5 rounded-full">
          Publicidad
        </span>

        {anuncio.imagen_url && (
          <img
            src={anuncio.imagen_url}
            alt={anuncio.titulo}
            className="block w-full max-h-[55vh] sm:max-h-[60vh] object-contain bg-card"
            loading="eager"
            decoding="async"
          />
        )}

        {anuncio.enlace_url && /^https?:\/\//i.test(anuncio.enlace_url) && (
          <div className="px-5 py-4">
            {anuncio.titulo && anuncio.titulo !== "Nuevo anuncio" && anuncio.titulo !== "Publicidad" && (
              <p className="font-semibold text-foreground text-base mb-1">{anuncio.titulo}</p>
            )}
            <a
              href={anuncio.enlace_url}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="mt-3 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all"
            >
              Visitar sitio <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default PopupAd;

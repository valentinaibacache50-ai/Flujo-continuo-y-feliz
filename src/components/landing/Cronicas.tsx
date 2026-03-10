import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, BookOpen, Image } from "lucide-react";

const SafeImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [error, setError] = useState(false);
  if (error) return <div className={`bg-secondary flex items-center justify-center ${className}`}><Image size={32} className="text-muted-foreground" /></div>;
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const Cronicas = () => {
  const { data: cronicas = [], isLoading } = useQuery({
    queryKey: ["noticias", "cronicas-landing"],
    queryFn: async () => {
      const { data, error } = await supabase.from("noticias").select("*")
        .or("tag.ilike.%crónica%,tag.ilike.%análisis%,tag.ilike.%contenido%")
        .order("fecha", { ascending: false }).limit(3);
      if (error) throw error;
      return data;
    },
  });

  const timeAgo = (date: string) => {
    try { return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es }); } catch { return ""; }
  };

  return (
    <section id="cronicas" className="py-28 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <p className="text-primary text-sm font-semibold mb-1 tracking-wider uppercase">Crónicas</p>
            <h2 className="font-space font-bold uppercase text-4xl md:text-5xl tracking-wide text-foreground">
              DESDE LA CANCHA
            </h2>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : cronicas.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay crónicas publicadas aún</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {cronicas.map((c, i) => (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
              >
                {c.imagen_url && (
                  <SafeImage src={c.imagen_url} alt={c.titulo} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <span className="inline-block text-[10px] font-semibold text-primary-foreground bg-primary/80 px-2.5 py-0.5 rounded-full tracking-wider mb-3">
                    {c.tag}
                  </span>
                  <h3 className="font-space font-semibold text-xl mb-2 text-foreground">{c.titulo}</h3>
                  {c.descripcion && <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{c.descripcion}</p>}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{timeAgo(c.fecha)}</span>
                    <span className="text-primary hover:underline cursor-pointer">Leer →</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Cronicas;

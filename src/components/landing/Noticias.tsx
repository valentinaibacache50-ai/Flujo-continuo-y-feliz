import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Newspaper } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const Noticias = () => {
  const { data: noticias = [], isLoading } = useQuery({
    queryKey: ["noticias"],
    queryFn: async () => {
      const { data, error } = await supabase.from("noticias").select("*").order("fecha", { ascending: false }).limit(5);
      if (error) throw error;
      return data;
    },
  });

  const timeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
    } catch {
      return "";
    }
  };

  return (
    <section id="noticias" className="py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <p className="text-primary text-sm font-semibold mb-1 tracking-wider uppercase">Noticias</p>
            <h2 className="font-space font-bold uppercase text-4xl md:text-5xl tracking-wide text-foreground">
              ÚLTIMAS NOTICIAS
            </h2>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : noticias.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay noticias publicadas aún</p>
          </div>
        ) : (
          <>
            {/* Featured article */}
            <motion.article
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl mb-8 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer group overflow-hidden"
            >
              {noticias[0].imagen_url ? (
                <div className="relative h-64 md:h-80">
                  <img src={noticias[0].imagen_url} alt={noticias[0].titulo} className="w-full h-full object-cover rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent rounded-2xl" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-full tracking-wider">{noticias[0].tag}</span>
                      {noticias[0].categoria && <span className="text-xs font-medium bg-accent/20 text-accent px-3 py-1 rounded-full">{noticias[0].categoria}</span>}
                    </div>
                    <h3 className="font-space font-bold text-2xl md:text-3xl mb-3 text-foreground">{noticias[0].titulo}</h3>
                    {noticias[0].descripcion && <p className="text-muted-foreground text-base mb-4 max-w-3xl">{noticias[0].descripcion}</p>}
                    <span className="text-xs text-muted-foreground">{timeAgo(noticias[0].fecha)}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-2xl p-8 md:p-10 hover:border-primary/50 group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-full tracking-wider">{noticias[0].tag}</span>
                      {noticias[0].categoria && <span className="text-xs font-medium bg-accent/20 text-accent px-3 py-1 rounded-full">{noticias[0].categoria}</span>}
                    </div>
                    <h3 className="font-space font-bold text-2xl md:text-3xl mb-3 text-foreground group-hover:text-primary transition-colors">{noticias[0].titulo}</h3>
                    {noticias[0].descripcion && <p className="text-muted-foreground text-base mb-4 max-w-3xl">{noticias[0].descripcion}</p>}
                    <span className="text-xs text-muted-foreground">{timeAgo(noticias[0].fecha)}</span>
                  </div>
                </div>
              )}
            </motion.article>

            {/* Grid */}
            {noticias.length > 1 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {noticias.slice(1).map((n, i) => (
                  <motion.article
                    key={n.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer group"
                  >
                    {n.imagen_url && (
                      <img src={n.imagen_url} alt={n.titulo} className="w-full h-36 object-cover" />
                    )}
                    <div className="p-6">
                      <span className="inline-block text-[10px] font-semibold text-primary-foreground bg-primary/80 px-2.5 py-0.5 rounded-full tracking-wider mb-3">{n.tag}</span>
                      <h3 className="font-space font-semibold text-base mb-2 text-foreground group-hover:text-primary transition-colors leading-snug">{n.titulo}</h3>
                      {n.descripcion && <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{n.descripcion}</p>}
                      <span className="text-xs text-muted-foreground">{timeAgo(n.fecha)}</span>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Noticias;

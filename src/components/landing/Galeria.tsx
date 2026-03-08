import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Image, Play, Loader2 } from "lucide-react";

const filters = ["Todo", "Fotos", "Videos"];

const Galeria = () => {
  const [filter, setFilter] = useState("Todo");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["galeria"],
    queryFn: async () => {
      const { data, error } = await supabase.from("galeria").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = filter === "Todo" ? items : items.filter((i) => i.tipo === (filter === "Fotos" ? "Foto" : "Video"));

  return (
    <section id="galeria" className="py-28 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="text-primary text-sm font-semibold mb-1 tracking-wider uppercase">Galería</p>
            <h2 className="font-space font-bold uppercase text-4xl md:text-5xl tracking-wide text-foreground">
              MOMENTOS CAPTURADOS
            </h2>
          </div>
        </motion.div>

        <div className="flex gap-3 mb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No hay contenido en la galería aún</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ scale: 1.03 }}
                className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer"
              >
                {item.imagen_url ? (
                  <img src={item.imagen_url} alt={item.titulo} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-card border border-border flex items-center justify-center">
                    <Image size={32} className="text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <span className="text-foreground text-sm font-medium">{item.titulo}</span>
                  <span className="text-xs text-primary flex items-center gap-1">
                    {item.tipo === "Video" && <Play size={10} />}
                    {item.tipo}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Galeria;

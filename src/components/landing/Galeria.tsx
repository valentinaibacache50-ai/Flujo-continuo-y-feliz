import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Image, Play, Loader2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const filters = ["Todo", "Fotos", "Videos"];

const Galeria = () => {
  const [filter, setFilter] = useState("Todo");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["galeria"],
    queryFn: async () => {
      const { data, error } = await supabase.from("galeria").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = filter === "Todo" ? items : items.filter((i) => i.tipo === (filter === "Fotos" ? "Foto" : "Video"));
  const selectedItem = selectedIndex !== null ? filtered[selectedIndex] : null;

  const goNext = () => {
    if (selectedIndex !== null && selectedIndex < filtered.length - 1) setSelectedIndex(selectedIndex + 1);
  };
  const goPrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
  };

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
                onClick={() => setSelectedIndex(i)}
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

      {/* Lightbox */}
      <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto p-0 bg-background/95 backdrop-blur-sm border-border overflow-hidden [&>button]:hidden">
          {selectedItem && (
            <div className="relative flex items-center justify-center min-h-[60vh]">
              {/* Close */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
              >
                <X size={20} />
              </button>

              {/* Prev */}
              {selectedIndex !== null && selectedIndex > 0 && (
                <button
                  onClick={goPrev}
                  className="absolute left-3 z-10 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Next */}
              {selectedIndex !== null && selectedIndex < filtered.length - 1 && (
                <button
                  onClick={goNext}
                  className="absolute right-3 z-10 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              )}

              {/* Content */}
              <div className="flex flex-col items-center">
                {selectedItem.imagen_url ? (
                  <img
                    src={selectedItem.imagen_url}
                    alt={selectedItem.titulo}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-64 h-64 bg-card flex items-center justify-center rounded-lg">
                    <Image size={48} className="text-muted-foreground" />
                  </div>
                )}
                <div className="p-4 text-center">
                  <p className="text-foreground font-medium">{selectedItem.titulo}</p>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    {selectedItem.tipo === "Video" && <Play size={10} />}
                    {selectedItem.tipo}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Galeria;

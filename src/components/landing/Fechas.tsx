import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Loader2, X, Clock, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const categoryColors: Record<string, string> = {
  "Sub-12": "bg-primary/20 text-primary border-primary/30",
  "Sub-15": "bg-accent/20 text-accent border-accent/30",
  "Sub-17": "bg-destructive/20 text-destructive border-destructive/30",
};

const FechaModal = ({ fixture, onClose }: { fixture: any; onClose: () => void }) => {
  const colorClass = categoryColors[fixture.categoria] || "bg-muted text-muted-foreground border-border";

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.28 }}
          className="relative bg-card rounded-2xl overflow-hidden w-full max-w-md shadow-2xl border border-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/70 hover:bg-background text-foreground transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="bg-primary/10 border-b border-border px-6 py-5">
            {fixture.en_vivo && (
              <div className="flex items-center gap-1.5 mb-3">
                <motion.span
                  className="inline-block w-2 h-2 rounded-full bg-destructive"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <span className="text-xs font-bold text-destructive uppercase tracking-wider">EN VIVO</span>
              </div>
            )}
            <div className="flex items-center justify-center gap-4">
              <span className="font-space font-bold text-xl text-foreground text-center flex-1">{fixture.local}</span>
              <span className="text-muted-foreground font-semibold text-sm px-2">VS</span>
              <span className="font-space font-bold text-xl text-foreground text-center flex-1">{fixture.visitante}</span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-foreground font-medium">{fixture.fecha}</span>
              <span className="text-muted-foreground">{fixture.dia}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-foreground font-medium">{fixture.hora}</span>
            </div>
            {fixture.sede && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-foreground">{fixture.sede}</span>
              </div>
            )}
            {fixture.categoria && (
              <div className="pt-1">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${colorClass}`}>
                  <Calendar className="h-3 w-3" />
                  {fixture.categoria}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

const Fechas = () => {
  const [selected, setSelected] = useState<any | null>(null);

  const { data: fixtures = [], isLoading } = useQuery({
    queryKey: ["fechas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fechas").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="fechas" className="py-16 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <p className="text-primary text-sm font-semibold mb-1 tracking-wider uppercase">Calendario</p>
            <h2 className="font-space font-bold uppercase text-4xl md:text-5xl tracking-wide text-foreground">
              PRÓXIMAS FECHAS
            </h2>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : fixtures.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No hay fechas programadas</p>
        ) : (
          <div className="space-y-3">
            {fixtures.map((f, i) => (
              <motion.button
                key={f.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                whileHover={{ x: 4 }}
                onClick={() => setSelected(f)}
                className="w-full text-left bg-card border border-border rounded-xl p-4 md:p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group flex flex-col md:flex-row md:items-center gap-3 md:gap-4 cursor-pointer"
              >
                {/* Date badge */}
                <div className="flex items-center gap-3 md:min-w-[160px]">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 text-center min-w-[64px]">
                    <p className="font-space font-bold text-primary text-base leading-tight">{f.fecha.split(" ")[0]}</p>
                    <p className="text-[10px] text-primary/70 uppercase font-semibold">{f.fecha.split(" ")[1] || ""}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-foreground font-medium">{f.dia}</p>
                    <p className="text-muted-foreground text-xs">{f.hora}</p>
                  </div>
                </div>

                {/* Teams */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {f.en_vivo && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-destructive uppercase">
                          <motion.span
                            className="inline-block w-2 h-2 rounded-full bg-destructive"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                          EN VIVO
                        </span>
                      )}
                      <p className="font-space font-semibold text-foreground group-hover:text-primary transition-colors text-sm md:text-base">
                        {f.local} <span className="text-muted-foreground font-normal mx-1 text-sm">vs</span> {f.visitante}
                      </p>
                    </div>
                    {f.sede && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{f.sede}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {f.categoria && (
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[f.categoria] || "bg-muted text-muted-foreground"}`}>
                        <Calendar className="h-3 w-3" />
                        {f.categoria}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {selected && <FechaModal fixture={selected} onClose={() => setSelected(null)} />}
    </section>
  );
};

export default Fechas;

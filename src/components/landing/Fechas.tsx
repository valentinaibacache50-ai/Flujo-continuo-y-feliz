import { motion } from "framer-motion";
import { Calendar, MapPin, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const categoryColors: Record<string, string> = {
  "Sub-12": "bg-primary/20 text-primary",
  "Sub-15": "bg-accent/20 text-accent",
  "Sub-17": "bg-destructive/20 text-destructive",
};

const Fechas = () => {
  const { data: fixtures = [], isLoading } = useQuery({
    queryKey: ["fechas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fechas").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="fechas" className="py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
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
          <div className="space-y-4">
            {fixtures.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ scale: 1.01, x: 4 }}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex items-center gap-4 md:min-w-[160px]">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-2 text-center min-w-[72px]">
                    <p className="font-space font-bold text-primary text-lg leading-tight">{f.fecha.split(" ")[0]}</p>
                    <p className="text-[10px] text-primary/70 uppercase font-semibold">{f.fecha.split(" ")[1] || ""}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-foreground font-medium">{f.dia}</p>
                    <p className="text-muted-foreground text-xs">{f.hora}</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
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
                      <p className="font-space font-semibold text-foreground group-hover:text-primary transition-colors">
                        {f.local} <span className="text-muted-foreground font-normal mx-1">vs</span> {f.visitante}
                      </p>
                    </div>
                    {f.sede && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{f.sede}</span>
                      </div>
                    )}
                  </div>

                  {f.categoria && (
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full w-fit ${categoryColors[f.categoria] || "bg-muted text-muted-foreground"}`}>
                      <Calendar className="h-3 w-3" />
                      {f.categoria}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Fechas;

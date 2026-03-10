import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Camera, Users, Radio, X, ChevronRight } from "lucide-react";

const catIcons: Record<string, typeof Camera> = {
  "Cobertura 2026": Camera,
  "Comunidad": Users,
  "Alcance": Radio,
};

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(motionValue, value, { duration: 1.5, ease: "easeOut" });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [motionValue, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

interface StatItem {
  id: string;
  categoria: string;
  label: string;
  value: string;
  suffix: string | null;
}

const StatDetailModal = ({ cat, items, onClose }: { cat: string; items: StatItem[]; onClose: () => void }) => {
  const Icon = catIcons[cat] || Camera;
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
          className="relative bg-card rounded-2xl overflow-hidden w-full max-w-sm shadow-2xl border border-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/70 hover:bg-background text-foreground transition-colors"
          >
            <X size={16} />
          </button>

          <div className="bg-primary/10 border-b border-border px-6 py-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-space font-bold uppercase text-lg text-foreground">Categoría {cat}</h3>
          </div>

          <div className="p-6 space-y-4">
            {items.map((s) => (
              <div key={s.id} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <span className="font-space font-bold text-primary text-2xl">
                  <AnimatedNumber value={Number(s.value) || 0} suffix={s.suffix || ""} />
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

function StatCard({ cat, items, delay, onClick }: { cat: string; items: StatItem[]; delay: number; onClick: () => void }) {
  const Icon = catIcons[cat] || Camera;
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="w-full text-left bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-space font-bold uppercase text-base text-foreground flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          Categoría {cat}
        </h3>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="space-y-3">
        {items.map((s) => (
          <div key={s.id} className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{s.label}</span>
            <span className="font-semibold text-primary text-lg">
              <AnimatedNumber value={Number(s.value) || 0} suffix={s.suffix || ""} />
            </span>
          </div>
        ))}
      </div>
    </motion.button>
  );
}

const Estadisticas = () => {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["estadisticas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("estadisticas").select("*").order("categoria");
      if (error) throw error;
      return data as StatItem[];
    },
  });

  const grouped = stats.reduce((acc, s) => {
    if (!acc[s.categoria]) acc[s.categoria] = [];
    acc[s.categoria].push(s);
    return acc;
  }, {} as Record<string, StatItem[]>);

  const entries = Object.entries(grouped);

  return (
    <section id="estadisticas" className="py-16 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-primary text-sm font-semibold mb-1 tracking-wider uppercase">Estadísticas</p>
          <h2 className="font-space font-bold uppercase text-4xl md:text-5xl tracking-wide text-foreground">
            DATOS ACTUALIZADOS
          </h2>
          <p className="text-muted-foreground text-sm mt-2">Tocá una tarjeta para ver el detalle completo</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No hay estadísticas disponibles</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {entries.map(([cat, items], i) => (
              <StatCard
                key={cat}
                cat={cat}
                items={items}
                delay={i * 0.08}
                onClick={() => setSelectedCat(cat)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedCat && grouped[selectedCat] && (
        <StatDetailModal
          cat={selectedCat}
          items={grouped[selectedCat]}
          onClose={() => setSelectedCat(null)}
        />
      )}
    </section>
  );
};

export default Estadisticas;

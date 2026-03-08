import { useState } from "react";
import { motion } from "framer-motion";

const filters = ["Todo", "Fotos", "Videos"];

const items = [
  { type: "Foto", emoji: "🎯", label: "Gol decisivo Sub-12" },
  { type: "Video", emoji: "▶", label: "Highlight Jornada 8" },
  { type: "Foto", emoji: "⚽", label: "Entrenamiento táctico" },
  { type: "Foto", emoji: "🏆", label: "Premiación torneo" },
  { type: "Video", emoji: "▶", label: "Resumen final Sub-17" },
  { type: "Foto", emoji: "🌟", label: "Jugador destacado" },
];

const Galeria = () => {
  const [filter, setFilter] = useState("Todo");

  const filtered = filter === "Todo" ? items : items.filter((i) => i.type === (filter === "Fotos" ? "Foto" : "Video"));

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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <motion.div
              key={`${filter}-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ scale: 1.05 }}
              className="aspect-square bg-card border border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{item.emoji}</span>
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-xs text-primary">{item.type}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Galeria;

import { motion } from "framer-motion";

const noticias = [
  {
    tag: "CRÓNICA",
    title: "La final Sub-12 que nadie olvidará: remontada, penales y lágrimas en el campo",
    desc: "Un partido que tuvo de todo. Goles, expulsiones, una remontada increíble y una definición a puro corazón.",
    date: "Hoy",
    read: "8 min de lectura",
    cat: "Sub-12",
  },
  {
    tag: "ESTADÍSTICAS",
    title: "Los números de la jornada 8: el equipo que sorprendió a todos",
    desc: "Tabla de posiciones, goleadores y los datos más llamativos de la fecha.",
    date: "Ayer",
    read: "4 min",
    cat: "",
  },
  {
    tag: "NOTA ESPECIAL",
    title: "Samuel, 11 años y ya lidera con la voz y con los pies",
    desc: "El mediocampista que sus entrenadores señalan como uno de los talentos más prometedores del departamento.",
    date: "Hace 3 días",
    read: "6 min",
    cat: "",
  },
  {
    tag: "GALERÍA",
    title: "32 fotos del entrenamiento táctico Sub-15",
    desc: "",
    date: "Hace 2 días",
    read: "",
    cat: "",
  },
  {
    tag: "ANÁLISIS",
    title: "¿Cuál es el equipo Sub-17 más en forma del mes?",
    desc: "",
    date: "Hace 5 días",
    read: "7 min",
    cat: "",
  },
];

const Noticias = () => (
  <section id="noticias" className="py-28 px-4">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
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
        <a href="#" className="text-primary text-sm hover:underline hidden md:inline">
          Ver todas →
        </a>
      </motion.div>

      {/* Featured article */}
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative bg-card border border-border rounded-2xl p-8 md:p-10 mb-8 hover:border-primary/50 transition-all cursor-pointer group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-full tracking-wider">
              {noticias[0].tag}
            </span>
            {noticias[0].cat && (
              <span className="text-xs font-medium bg-accent/20 text-accent px-3 py-1 rounded-full">
                {noticias[0].cat}
              </span>
            )}
          </div>
          <h3 className="font-space font-bold text-2xl md:text-3xl mb-3 text-foreground group-hover:text-primary transition-colors">
            {noticias[0].title}
          </h3>
          <p className="text-muted-foreground text-base mb-4 max-w-3xl">{noticias[0].desc}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{noticias[0].date}</span>
            {noticias[0].read && <span>· {noticias[0].read}</span>}
          </div>
        </div>
      </motion.article>

      {/* Grid of remaining articles */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {noticias.slice(1).map((n, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group"
          >
            <span className="inline-block text-[10px] font-semibold text-primary-foreground bg-primary/80 px-2.5 py-0.5 rounded-full tracking-wider mb-3">
              {n.tag}
            </span>
            <h3 className="font-space font-semibold text-base mb-2 text-foreground group-hover:text-primary transition-colors leading-snug">
              {n.title}
            </h3>
            {n.desc && <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{n.desc}</p>}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
              <span>{n.date}</span>
              {n.read && <span>· {n.read}</span>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default Noticias;

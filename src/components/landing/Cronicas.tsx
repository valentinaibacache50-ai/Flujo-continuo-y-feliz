import { motion } from "framer-motion";

const cronicas = [
  {
    tag: "CRÓNICA SUB-12",
    title: "La final que hizo llorar hasta al árbitro",
    desc: "Cinco goles, dos expulsiones y una tanda de penales interminable. Una crónica del partido que resumió toda una temporada.",
    date: "Hoy",
  },
  {
    tag: "ANÁLISIS SUB-17",
    title: "¿Por qué el Sub-17 es el equipo más completo del torneo?",
    desc: "Datos, tácticas y los testimonios de los protagonistas detrás del equipo favorito.",
    date: "Hace 5 días",
  },
  {
    tag: "CONTENIDO EXCLUSIVO",
    title: "Entrevista con el DT revelación del torneo",
    desc: "Habla el técnico que llevó a un equipo desconocido a semifinales con puro corazón y táctica.",
    date: "Hace 3 días",
  },
];

const Cronicas = () => (
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
        <a href="#" className="text-primary text-sm hover:underline hidden md:inline">
          Ver todas →
        </a>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {cronicas.map((c, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
          >
            <span className="inline-block text-[10px] font-semibold text-primary-foreground bg-primary/80 px-2.5 py-0.5 rounded-full tracking-wider mb-3">
              {c.tag}
            </span>
            <h3 className="font-space font-semibold text-xl mb-2 text-foreground">{c.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{c.desc}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{c.date}</span>
              <a href="#" className="text-primary hover:underline">Leer →</a>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default Cronicas;

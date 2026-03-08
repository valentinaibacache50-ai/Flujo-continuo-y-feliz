import { motion } from "framer-motion";
import { Users, Trophy, Camera, Heart, Target, MapPin } from "lucide-react";

const valores = [
  {
    icon: Trophy,
    title: "Formación deportiva",
    desc: "Promovemos el desarrollo integral de jóvenes futbolistas a través del deporte, la disciplina y el trabajo en equipo.",
  },
  {
    icon: Camera,
    title: "Cobertura profesional",
    desc: "Documentamos cada partido, entrenamiento y momento especial con fotos y videos de alta calidad.",
  },
  {
    icon: Heart,
    title: "Pasión por el barrio",
    desc: "Nacimos en la cancha de barrio y creemos que el fútbol juvenil merece la misma visibilidad que el profesional.",
  },
  {
    icon: Target,
    title: "Compromiso con el talento",
    desc: "Identificamos y destacamos a los jóvenes talentos que merecen ser vistos por el mundo.",
  },
  {
    icon: Users,
    title: "Comunidad",
    desc: "Más que un medio deportivo, somos una familia de padres, entrenadores y jugadores unidos por el fútbol.",
  },
  {
    icon: MapPin,
    title: "Presencia local",
    desc: "Cubrimos torneos juveniles y de barrio en todo el departamento, llevando las historias que nadie más cuenta.",
  },
];

const QuienesSomos = () => (
  <section id="quienes-somos" className="py-28 px-4">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-primary text-sm font-semibold mb-1 tracking-wider uppercase">Nosotros</p>
        <h2 className="font-space font-bold uppercase text-4xl md:text-5xl tracking-wide text-foreground mb-4">
          QUIÉNES SOMOS
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
          <strong className="text-foreground">Semillero de Campeones</strong> es un portal deportivo independiente
          dedicado a la cobertura del fútbol juvenil y de barrio. Creemos que cada gol, cada jugada y cada historia
          en las canchas de formación merece ser contada con la misma calidad y pasión que el fútbol profesional.
        </p>
      </motion.div>

      {/* Mission statement */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative bg-card border border-border rounded-2xl p-8 md:p-12 mb-12 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <span className="text-4xl mb-4 block">⚽</span>
          <h3 className="font-space font-bold uppercase text-2xl md:text-3xl text-foreground mb-4">
            NUESTRA MISIÓN
          </h3>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Visibilizar el talento joven, documentar las historias que nacen en las canchas de barrio y construir
            una comunidad alrededor del fútbol de formación. Queremos que cada niño y joven que pisa una cancha
            sepa que su esfuerzo importa y que alguien está ahí para contarlo.
          </p>
        </div>
      </motion.div>

      {/* Values grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {valores.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <v.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-space font-bold uppercase text-base text-foreground mb-2">{v.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default QuienesSomos;

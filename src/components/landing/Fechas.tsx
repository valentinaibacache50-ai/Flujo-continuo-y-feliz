import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

const fixtures = [
  {
    date: "12 MAR",
    day: "Sábado",
    time: "9:00 AM",
    home: "Halcones FC",
    away: "Rayos del Sur",
    category: "Sub-12",
    venue: "Cancha La Bombonera",
    live: true,
  },
  {
    date: "12 MAR",
    day: "Sábado",
    time: "11:00 AM",
    home: "Tigres Unidos",
    away: "Estrellas del Norte",
    category: "Sub-15",
    venue: "Cancha La Bombonera",
    live: false,
  },
  {
    date: "13 MAR",
    day: "Domingo",
    time: "8:30 AM",
    home: "Cachorros FC",
    away: "Leones de Oro",
    category: "Sub-12",
    venue: "Polideportivo Central",
    live: false,
  },
  {
    date: "13 MAR",
    day: "Domingo",
    time: "10:00 AM",
    home: "Águilas Rojas",
    away: "Guerreros FC",
    category: "Sub-17",
    venue: "Polideportivo Central",
    live: false,
  },
  {
    date: "15 MAR",
    day: "Martes",
    time: "4:00 PM",
    home: "Semillero A",
    away: "Semillero B",
    category: "Sub-15",
    venue: "Cancha de Entrenamiento",
    live: false,
  },
  {
    date: "19 MAR",
    day: "Sábado",
    time: "9:00 AM",
    home: "Final - Por definir",
    away: "Por definir",
    category: "Sub-12",
    venue: "Estadio Municipal",
    live: false,
  },
];

const categoryColors: Record<string, string> = {
  "Sub-12": "bg-primary/20 text-primary",
  "Sub-15": "bg-accent/20 text-accent",
  "Sub-17": "bg-destructive/20 text-destructive",
};

const Fechas = () => (
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
        <a href="#" className="text-primary text-sm hover:underline hidden md:inline">
          Ver calendario completo →
        </a>
      </motion.div>

      <div className="space-y-4">
        {fixtures.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ scale: 1.01, x: 4 }}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group flex flex-col md:flex-row md:items-center gap-4"
          >
            {/* Date block */}
            <div className="flex items-center gap-4 md:min-w-[160px]">
              <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-2 text-center min-w-[72px]">
                <p className="font-space font-bold text-primary text-lg leading-tight">{f.date.split(" ")[0]}</p>
                <p className="text-[10px] text-primary/70 uppercase font-semibold">{f.date.split(" ")[1]}</p>
              </div>
              <div className="text-sm">
                <p className="text-foreground font-medium">{f.day}</p>
                <p className="text-muted-foreground text-xs">{f.time}</p>
              </div>
            </div>

            {/* Match info */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {f.live && (
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
                    {f.home} <span className="text-muted-foreground font-normal mx-1">vs</span> {f.away}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{f.venue}</span>
                </div>
              </div>

              {/* Category pill */}
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full w-fit ${categoryColors[f.category] || "bg-muted text-muted-foreground"}`}>
                <Calendar className="h-3 w-3" />
                {f.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Fechas;

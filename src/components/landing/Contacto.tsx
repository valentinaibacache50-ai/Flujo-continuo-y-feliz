import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trophy, Camera, Users } from "lucide-react";

const valores = [
  { icon: Trophy, title: "Formación deportiva", desc: "Desarrollo integral de jóvenes futbolistas." },
  { icon: Camera, title: "Cobertura profesional", desc: "Fotos y videos de alta calidad en cada partido." },
  { icon: Users, title: "Comunidad", desc: "Una familia de padres, entrenadores y jugadores." },
];

const Contacto = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ nombre: "", asunto: "", mensaje: "" });

  const { data: config } = useQuery({
    queryKey: ["contacto_config"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contacto_config").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = (config?.whatsapp ?? "+54 9 1167391965").replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hola, soy ${form.nombre}.\n\n*Asunto:* ${form.asunto}\n\n${form.mensaje}`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    toast({ title: "Redirigiendo a WhatsApp", description: "Se abrirá una nueva ventana." });
    setForm({ nombre: "", asunto: "", mensaje: "" });
  };

  const whatsapp = config?.whatsapp ?? "+57 300 000 0000";
  const facebook = config?.facebook ?? "@semillerodecampeonesav";
  const cobertura = config?.cobertura ?? "Fútbol Juvenil y de Barrio";

  return (
    <section id="contacto" className="py-16 md:py-24 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        {/* Contact header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-primary text-sm font-semibold mb-1 tracking-wider uppercase">Contacto</p>
          <h2 className="font-space font-bold uppercase text-4xl md:text-5xl tracking-wide text-foreground">
            ESCRIBINOS
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm md:text-base">
            ¿Querés solicitar cobertura, comprar contenido o tenés una historia que merece ser contada? Estamos para vos.
          </p>
        </motion.div>

        {/* Form + info */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-space font-bold uppercase text-sm text-foreground mb-0.5">📱 WHATSAPP</h3>
              <p className="text-muted-foreground text-sm">{whatsapp}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-space font-bold uppercase text-sm text-foreground mb-0.5">📘 FACEBOOK</h3>
              <p className="text-muted-foreground text-sm">{facebook}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-space font-bold uppercase text-sm text-foreground mb-0.5">📍 COBERTURA</h3>
              <p className="text-muted-foreground text-sm">{cobertura}</p>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <input
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
              required
            />
            <input
              placeholder="Asunto"
              value={form.asunto}
              onChange={(e) => setForm({ ...form, asunto: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
              required
            />
            <textarea
              placeholder="Contanos cómo podemos ayudarte..."
              rows={4}
              value={form.mensaje}
              onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none transition-colors text-sm"
              required
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all text-sm"
            >
              Enviar mensaje
            </button>
          </motion.form>
        </div>

        {/* Quiénes somos — compact at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-14 pt-10 border-t border-border/50"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Quiénes somos</p>
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
            <strong className="text-foreground">Semillero de Campeones</strong> es un portal deportivo independiente
            dedicado a la cobertura del fútbol juvenil y de barrio.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {valores.map((v) => (
              <div key={v.title} className="flex items-start gap-3 bg-card/50 border border-border/50 rounded-lg p-3">
                <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <v.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{v.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contacto;

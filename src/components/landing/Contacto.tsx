import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Contacto = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ nombre: "", whatsapp: "", asunto: "", mensaje: "" });

  const { data: config, isLoading } = useQuery({
    queryKey: ["contacto_config"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contacto_config").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format WhatsApp number - remove spaces and special characters, keep only digits
    const phoneNumber = (config?.whatsapp ?? "+54 9 1167391965").replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hola, soy ${form.nombre}.\n\n*Asunto:* ${form.asunto}\n\n${form.mensaje}\n\n📱 Mi WhatsApp: ${form.whatsapp}`
    );
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    toast({ title: "Redirigiendo a WhatsApp", description: "Se abrirá una nueva ventana." });
    setForm({ nombre: "", whatsapp: "", asunto: "", mensaje: "" });
  };

  const whatsapp = config?.whatsapp ?? "+57 300 000 0000";
  const facebook = config?.facebook ?? "@semillerodecampeonesav";
  const cobertura = config?.cobertura ?? "Fútbol Juvenil y de Barrio · Colombia";

  return (
    <section id="contacto" className="py-16 md:py-28 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm font-semibold mb-1 tracking-wider uppercase">Contacto</p>
          <h2 className="font-space font-bold uppercase text-4xl md:text-5xl tracking-wide text-foreground">
            ESCRIBINOS
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            ¿Querés solicitar cobertura de un partido, comprar contenido o tenés una historia que merece ser contada? Estamos para vos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-space font-bold uppercase text-base text-foreground mb-1">📱 WHATSAPP</h3>
              <p className="text-muted-foreground">{whatsapp}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-space font-bold uppercase text-base text-foreground mb-1">📘 FACEBOOK</h3>
              <p className="text-muted-foreground">{facebook}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-space font-bold uppercase text-base text-foreground mb-1">📍 COBERTURA</h3>
              <p className="text-muted-foreground">{cobertura}</p>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" required />
            <input placeholder="WhatsApp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" required />
            <input placeholder="Asunto" value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" required />
            <textarea placeholder="Contanos cómo podemos ayudarte..." rows={4} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none transition-colors" required />
            <button type="submit" className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              Enviar mensaje
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contacto;

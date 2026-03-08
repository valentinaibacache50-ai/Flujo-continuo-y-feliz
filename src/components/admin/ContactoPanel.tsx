import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

const ContactoPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: config, isLoading } = useQuery({
    queryKey: ["contacto_config"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contacto_config").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  const [whatsapp, setWhatsapp] = useState("");
  const [facebook, setFacebook] = useState("");
  const [cobertura, setCobertura] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (config && !initialized) {
    setWhatsapp(config.whatsapp);
    setFacebook(config.facebook);
    setCobertura(config.cobertura);
    setInitialized(true);
  }

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!config) return;
      const { error } = await supabase.from("contacto_config").update({ whatsapp, facebook, cobertura }).eq("id", config.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacto_config"] });
      toast({ title: "Contacto actualizado" });
    },
    onError: () => toast({ title: "Error al guardar", variant: "destructive" }),
  });

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="p-6">
      <h2 className="font-space font-bold uppercase text-2xl text-foreground mb-6">Configuración de Contacto</h2>
      <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(); }} className="bg-card border border-border rounded-xl p-5 space-y-4 max-w-2xl">
        <div>
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">WhatsApp</label>
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full mt-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Facebook</label>
          <input value={facebook} onChange={(e) => setFacebook(e.target.value)} className="w-full mt-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Cobertura</label>
          <input value={cobertura} onChange={(e) => setCobertura(e.target.value)} className="w-full mt-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <button type="submit" disabled={updateMutation.isPending} className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
          {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default ContactoPanel;

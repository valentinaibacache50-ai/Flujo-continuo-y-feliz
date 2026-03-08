import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

const HeroPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: hero, isLoading } = useQuery({
    queryKey: ["hero_config"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero_config").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  const [badge, setBadge] = useState("");
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaHref, setCtaHref] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (hero && !initialized) {
    setBadge(hero.badge);
    setTitle1(hero.title1);
    setTitle2(hero.title2);
    setDescription(hero.description);
    setCtaText(hero.cta_text);
    setCtaHref(hero.cta_href);
    setInitialized(true);
  }

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!hero) return;
      const { error } = await supabase.from("hero_config").update({ badge, title1, title2, description, cta_text: ctaText, cta_href: ctaHref }).eq("id", hero.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero_config"] });
      toast({ title: "Hero actualizado" });
    },
    onError: () => toast({ title: "Error al guardar", variant: "destructive" }),
  });

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="p-6">
      <h2 className="font-space font-bold uppercase text-2xl text-foreground mb-6">Configuración del Hero</h2>
      <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(); }} className="bg-card border border-border rounded-xl p-5 space-y-4 max-w-2xl">
        <div>
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Badge / Subtítulo superior</label>
          <input value={badge} onChange={(e) => setBadge(e.target.value)} className="w-full mt-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Título línea 1</label>
            <input value={title1} onChange={(e) => setTitle1(e.target.value)} className="w-full mt-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Título línea 2</label>
            <input value={title2} onChange={(e) => setTitle2(e.target.value)} className="w-full mt-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Descripción</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full mt-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Texto del botón</label>
            <input value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full mt-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Enlace del botón</label>
            <input value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} className="w-full mt-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
        </div>
        <button type="submit" disabled={updateMutation.isPending} className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
          {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default HeroPanel;

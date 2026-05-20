import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, CalendarDays } from "lucide-react";

const inputCls = "w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm";

const NavbarPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);
  const [usarFechaAuto, setUsarFechaAuto] = useState(true);
  const [fechaTexto, setFechaTexto] = useState("");

  const { data: config, isLoading } = useQuery({
    queryKey: ["navbar_config"],
    queryFn: async () => {
      const { data, error } = await supabase.from("navbar_config").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  if (config && !initialized) {
    setUsarFechaAuto(config.usar_fecha_auto);
    setFechaTexto(config.fecha_texto || "");
    setInitialized(true);
  }

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!config) return;
      const { error } = await supabase.from("navbar_config").update({
        usar_fecha_auto: usarFechaAuto,
        fecha_texto: usarFechaAuto ? null : fechaTexto || null,
      }).eq("id", config.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navbar_config"] });
      toast({ title: "Fecha del navbar actualizada" });
    },
    onError: () => toast({ title: "Error al guardar", variant: "destructive" }),
  });

  const todayPreview = new Date().toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="p-4 sm:p-6">
      <h2 className="font-space font-bold uppercase text-xl sm:text-2xl text-foreground mb-6">Fecha del Navbar</h2>

      <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(); }} className="bg-card border border-border rounded-xl p-5 space-y-4 max-w-2xl">
        {/* Toggle auto/manual */}
        <div className="flex items-center gap-3 bg-secondary/50 border border-border rounded-lg px-4 py-3">
          <CalendarDays size={16} className="text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Fecha automatica</p>
            <p className="text-xs text-muted-foreground">Muestra la fecha de hoy automaticamente</p>
          </div>
          <button
            type="button"
            onClick={() => setUsarFechaAuto(!usarFechaAuto)}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${usarFechaAuto ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${usarFechaAuto ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {usarFechaAuto ? (
          <div className="text-sm text-muted-foreground bg-secondary/30 rounded-lg px-4 py-3">
            Vista previa: <span className="text-foreground font-medium capitalize">{todayPreview}</span>
          </div>
        ) : (
          <div>
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Texto personalizado</label>
            <input
              value={fechaTexto}
              onChange={(e) => setFechaTexto(e.target.value)}
              placeholder="Ej: Fecha 5 - Zona A"
              className={`${inputCls} mt-1`}
              maxLength={100}
            />
            {fechaTexto && (
              <div className="text-sm text-muted-foreground mt-2 bg-secondary/30 rounded-lg px-4 py-3">
                Vista previa: <span className="text-foreground font-medium">{fechaTexto}</span>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
        >
          {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default NavbarPanel;

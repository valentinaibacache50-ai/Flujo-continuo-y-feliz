import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Image, BarChart3, Calendar, ShoppingBag, FileText, Loader2 } from "lucide-react";

interface DashboardPanelProps {
  onNavigate?: (panel: string) => void;
}

const DashboardPanel = ({ onNavigate }: DashboardPanelProps) => {
  const { data: noticiasCount = 0 } = useQuery({
    queryKey: ["count-noticias"],
    queryFn: async () => {
      const { count } = await supabase.from("noticias").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: galeriaCount = 0 } = useQuery({
    queryKey: ["count-galeria"],
    queryFn: async () => {
      const { count } = await supabase.from("galeria").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: fechasCount = 0 } = useQuery({
    queryKey: ["count-fechas"],
    queryFn: async () => {
      const { count } = await supabase.from("fechas").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: estadisticasCount = 0 } = useQuery({
    queryKey: ["count-estadisticas"],
    queryFn: async () => {
      const { count } = await supabase.from("estadisticas").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: recentNoticias = [], isLoading: loadingRecent } = useQuery({
    queryKey: ["recent-noticias"],
    queryFn: async () => {
      const { data, error } = await supabase.from("noticias").select("titulo, tag, fecha").order("fecha", { ascending: false }).limit(5);
      if (error) throw error;
      return data;
    },
  });

  const stats = [
    { label: "NOTICIAS", value: noticiasCount, icon: Newspaper, panel: "noticias" },
    { label: "GALERÍA", value: galeriaCount, icon: Image, panel: "galeria" },
    { label: "FECHAS", value: fechasCount, icon: Calendar, panel: "fechas" },
    { label: "ESTADÍSTICAS", value: estadisticasCount, icon: BarChart3, panel: "estadisticas" },
  ];

  const quickActions = [
    { label: "Publicar nueva noticia", icon: FileText, panel: "noticias" },
    { label: "Subir fotos o videos", icon: Image, panel: "galeria" },
    { label: "Actualizar estadísticas", icon: BarChart3, panel: "estadisticas" },
    { label: "Agregar fecha de partido", icon: Calendar, panel: "fechas" },
    { label: "Agregar producto a tienda", icon: ShoppingBag, panel: "productos" },
  ];

  const handleNavigate = (panel: string) => {
    onNavigate?.(panel);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => handleNavigate(s.panel)}
            className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold tracking-wider">{s.label}</span>
              <s.icon size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{s.value}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-space font-bold uppercase text-xl text-foreground mb-4">ACTIVIDAD RECIENTE</h3>
          {loadingRecent ? (
            <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
          ) : recentNoticias.length > 0 ? (
            <div className="space-y-3">
              {recentNoticias.map((n, i) => (
                <div key={i} className="flex items-start justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <span className="text-foreground truncate block">{n.titulo}</span>
                    <span className="text-xs text-primary">{n.tag}</span>
                  </div>
                  <span className="text-muted-foreground whitespace-nowrap text-xs">
                    {new Date(n.fecha).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-space font-bold uppercase text-xl text-foreground mb-4">ACCIONES RÁPIDAS</h3>
          <div className="space-y-2">
            {quickActions.map((a, i) => (
              <button
                key={i}
                onClick={() => handleNavigate(a.panel)}
                className="w-full text-left px-4 py-3 bg-secondary rounded-lg text-foreground text-sm hover:bg-primary/20 transition-colors flex items-center gap-3"
              >
                <a.icon size={16} className="text-primary flex-shrink-0" />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;

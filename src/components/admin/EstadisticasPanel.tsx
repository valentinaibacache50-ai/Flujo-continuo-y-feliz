import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, Pencil, X } from "lucide-react";

const EstadisticasPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoria, setCategoria] = useState("");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [suffix, setSuffix] = useState("");

  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["estadisticas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("estadisticas").select("*").order("categoria");
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setCategoria(""); setLabel(""); setValue(""); setSuffix("");
    setEditingId(null); setShowForm(false);
  };

  const startEdit = (s: any) => {
    setEditingId(s.id);
    setCategoria(s.categoria); setLabel(s.label); setValue(s.value); setSuffix(s.suffix || "");
    setShowForm(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { categoria, label, value, suffix: suffix || null };
      if (editingId) {
        const { error } = await supabase.from("estadisticas").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("estadisticas").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estadisticas"] });
      resetForm();
      toast({ title: editingId ? "Estadística actualizada" : "Estadística agregada" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("estadisticas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estadisticas"] });
      toast({ title: "Eliminada" });
    },
  });

  const grouped = stats.reduce((acc, s) => {
    if (!acc[s.categoria]) acc[s.categoria] = [];
    acc[s.categoria].push(s);
    return acc;
  }, {} as Record<string, typeof stats>);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground">Gestión de Estadísticas</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
          <Plus size={16} /> Nueva
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3 relative">
          <button type="button" onClick={resetForm} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X size={18} /></button>
          <h3 className="text-sm font-semibold text-foreground mb-1">{editingId ? "Editar estadística" : "Nueva estadística"}</h3>
          <input placeholder="Categoría (ej: Sub-12)" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          <input placeholder="Label (ej: Partidos jugados)" value={label} onChange={(e) => setLabel(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          <div className="flex gap-3">
            <input placeholder="Valor (ej: 24)" value={value} onChange={(e) => setValue(e.target.value)} className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
            <input placeholder="Sufijo (ej: %)" value={suffix} onChange={(e) => setSuffix(e.target.value)} className="w-24 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          </div>
          <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
            {editingId ? "Actualizar" : "Guardar"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-space font-bold uppercase text-xl text-foreground mb-4">{cat}</h3>
              <div className="space-y-2">
                {items.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-primary">{s.value}{s.suffix}</span>
                      <button onClick={() => startEdit(s)} className="text-muted-foreground hover:text-primary"><Pencil size={14} /></button>
                      <button onClick={() => deleteMutation.mutate(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {stats.length === 0 && <p className="text-center text-muted-foreground py-8">No hay estadísticas aún</p>}
        </div>
      )}
    </div>
  );
};

export default EstadisticasPanel;

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, Pencil, X, Radio } from "lucide-react";

const inputCls = "w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm";

const FechasPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fecha, setFecha] = useState("");
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");
  const [visitante, setVisitante] = useState("");
  const [categoria, setCategoria] = useState("");
  const [sede, setSede] = useState("");
  const [enVivo, setEnVivo] = useState(false);

  const { data: fechas = [], isLoading } = useQuery({
    queryKey: ["fechas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fechas").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setFecha(""); setDia(""); setHora(""); setLocal(""); setVisitante("");
    setCategoria(""); setSede(""); setEnVivo(false);
    setEditingId(null); setShowForm(false);
  };

  const startEdit = (f: any) => {
    setEditingId(f.id);
    setFecha(f.fecha); setDia(f.dia); setHora(f.hora);
    setLocal(f.local); setVisitante(f.visitante);
    setCategoria(f.categoria || ""); setSede(f.sede || "");
    setEnVivo(f.en_vivo ?? false);
    setShowForm(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        fecha, dia, hora, local, visitante,
        categoria: categoria || null,
        sede: sede || null,
        en_vivo: enVivo,
      };
      if (editingId) {
        const { error } = await supabase.from("fechas").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("fechas").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fechas"] });
      resetForm();
      toast({ title: editingId ? "Fecha actualizada" : "Fecha agregada" });
    },
    onError: (err: any) => toast({ title: err?.message || "Error al guardar fecha", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fechas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fechas"] });
      toast({ title: "Fecha eliminada" });
    },
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-xl sm:text-2xl text-foreground">Gestión de Fechas</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90"
        >
          <Plus size={16} /> Nueva
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}
          className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3 relative"
        >
          <button type="button" onClick={resetForm} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
          <h3 className="text-sm font-semibold text-foreground">{editingId ? "Editar fecha" : "Nueva fecha"}</h3>

          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Fecha (ej: 15 MAR)" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputCls} required />
            <input placeholder="Día (ej: Sábado)" value={dia} onChange={(e) => setDia(e.target.value)} className={inputCls} required />
          </div>
          <input placeholder="Hora (ej: 10:00)" value={hora} onChange={(e) => setHora(e.target.value)} className={inputCls} required />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Equipo local" value={local} onChange={(e) => setLocal(e.target.value)} className={inputCls} required />
            <input placeholder="Equipo visitante" value={visitante} onChange={(e) => setVisitante(e.target.value)} className={inputCls} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Categoría</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={inputCls}>
                <option value="">Sin categoría</option>
                <option value="Sub-12">Sub-12</option>
                <option value="Sub-15">Sub-15</option>
                <option value="Sub-17">Sub-17</option>
                <option value="Sub-20">Sub-20</option>
                <option value="Primera">Primera</option>
              </select>
            </div>
            <input placeholder="Sede (opcional)" value={sede} onChange={(e) => setSede(e.target.value)} className={inputCls} />
          </div>

          {/* EN VIVO toggle */}
          <div className="flex items-center gap-3 pt-1 bg-destructive/5 border border-destructive/20 rounded-lg px-4 py-3">
            <Radio size={16} className={enVivo ? "text-destructive" : "text-muted-foreground"} />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">EN VIVO</p>
              <p className="text-xs text-muted-foreground">Muestra el indicador pulsante en la tarjeta</p>
            </div>
            <button
              type="button"
              onClick={() => setEnVivo(!enVivo)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${enVivo ? "bg-destructive" : "bg-muted"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enVivo ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
          >
            {saveMutation.isPending && <Loader2 size={14} className="animate-spin" />}
            {editingId ? "Actualizar" : "Guardar"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-2.5">
          {fechas.map((f) => (
            <div key={f.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {f.en_vivo && (
                    <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">● EN VIVO</span>
                  )}
                  <h3 className="text-foreground font-medium text-sm">{f.local} vs {f.visitante}</h3>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1.5">
                  <span className="bg-primary/15 text-primary px-2 py-0.5 rounded">{f.fecha} — {f.dia} {f.hora}</span>
                  {f.categoria && <span className="bg-muted px-2 py-0.5 rounded">{f.categoria}</span>}
                  {f.sede && <span>📍 {f.sede}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => startEdit(f)} className="text-muted-foreground hover:text-primary p-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteMutation.mutate(f.id)} className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {fechas.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">No hay fechas aún</p>}
        </div>
      )}
    </div>
  );
};

export default FechasPanel;

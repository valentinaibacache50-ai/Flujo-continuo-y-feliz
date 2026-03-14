import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, Pencil, X, BarChart2 } from "lucide-react";

const inputCls = "w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm";

const CATEGORY_PRESETS = [
  "Sub-12", "Sub-15", "Sub-17", "Sub-20", "Primera",
  "Cobertura 2026", "Comunidad", "Alcance",
  "Goles", "Partidos", "Jugadores", "Equipos",
  "Asistencias", "Tarjetas", "Árbitros", "Torneos",
  "Sedes", "Categorías", "Temporadas", "Redes Sociales",
];
const SUFFIX_PRESETS = ["%", "k", "M", "+", "hs", "min"];

const EstadisticasPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoria, setCategoria] = useState("");
  const [categoriaCustom, setCategoriaCustom] = useState(false);
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
    setCategoria(""); setCategoriaCustom(false);
    setLabel(""); setValue(""); setSuffix("");
    setEditingId(null); setShowForm(false);
  };

  const startEdit = (s: any) => {
    setEditingId(s.id);
    setCategoria(s.categoria);
    setCategoriaCustom(!CATEGORY_PRESETS.includes(s.categoria));
    setLabel(s.label); setValue(s.value); setSuffix(s.suffix || "");
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
    onError: (err: any) => toast({ title: err?.message || "Error al guardar", variant: "destructive" }),
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
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-xl sm:text-2xl text-foreground">Estadísticas</h2>
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
          className="bg-card border border-primary/30 rounded-xl p-5 mb-6 space-y-4 relative"
        >
          <button type="button" onClick={resetForm} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
          <h3 className="text-sm font-semibold text-foreground">{editingId ? "Editar estadística" : "Nueva estadística"}</h3>

          {/* Categoría */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Categoría</label>
            {!categoriaCustom ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCategoria(p)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        categoria === p
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setCategoriaCustom(true)} className="text-xs text-primary hover:underline">
                  + Ingresar categoría personalizada
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  placeholder="Categoría personalizada"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className={inputCls}
                  required
                />
                <button type="button" onClick={() => setCategoriaCustom(false)} className="text-xs text-muted-foreground hover:text-foreground whitespace-nowrap">
                  Ver presets
                </button>
              </div>
            )}
          </div>

          {/* Label */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Etiqueta (qué se mide)</label>
            <input
              placeholder="ej: Partidos jugados, Seguidores, Cobertura..."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className={inputCls}
              required
            />
          </div>

          {/* Value + suffix */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Valor numérico</label>
              <input
                placeholder="ej: 24"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Sufijo (opcional)</label>
              <input
                placeholder="ej: %"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                className={inputCls}
                list="suffix-presets"
              />
              <datalist id="suffix-presets">
                {SUFFIX_PRESETS.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
          </div>

          {/* Preview */}
          {value && (
            <div className="bg-secondary/50 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label || "Etiqueta"}</span>
              <span className="font-space font-bold text-primary text-xl">{value}{suffix}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saveMutation.isPending || !categoria || !label || !value}
            className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
          >
            {saveMutation.isPending && <Loader2 size={14} className="animate-spin" />}
            {editingId ? "Actualizar" : "Guardar estadística"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-primary/5 border-b border-border">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-primary" />
                  <h3 className="font-space font-bold uppercase text-sm text-foreground">{cat}</h3>
                </div>
                <span className="text-xs text-muted-foreground">{items.length} elemento{items.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="divide-y divide-border">
                {items.map((s) => (
                  <div key={s.id} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-muted-foreground flex-1 min-w-0 truncate mr-3">{s.label}</span>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-semibold text-primary text-base">{s.value}{s.suffix}</span>
                      <button onClick={() => startEdit(s)} className="text-muted-foreground hover:text-primary p-1 rounded hover:bg-primary/10 transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => deleteMutation.mutate(s.id)} className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {stats.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BarChart2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No hay estadísticas aún</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EstadisticasPanel;

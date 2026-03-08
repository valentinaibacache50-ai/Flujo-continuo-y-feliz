import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2 } from "lucide-react";

const QuienesSomosPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [icono, setIcono] = useState("");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["quienes_somos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quienes_somos").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("quienes_somos").insert({ titulo, descripcion, icono: icono || null });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quienes_somos"] });
      setTitulo(""); setDescripcion(""); setIcono("");
      setShowForm(false);
      toast({ title: "Valor agregado" });
    },
    onError: () => toast({ title: "Error al agregar", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("quienes_somos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quienes_somos"] });
      toast({ title: "Eliminado" });
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground">Quiénes Somos</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
          <Plus size={16} /> Nuevo valor
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate(); }} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3">
          <input placeholder="Título (ej: Formación deportiva)" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" required />
          <input placeholder="Icono (Trophy, Camera, Heart, Target, Users, MapPin)" value={icono} onChange={(e) => setIcono(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          <button type="submit" disabled={addMutation.isPending} className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
            {addMutation.isPending && <Loader2 size={14} className="animate-spin" />}
            Guardar
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="text-foreground font-medium">{item.titulo}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.descripcion}</p>
                {item.icono && <span className="text-xs text-primary mt-1 inline-block">Icono: {item.icono}</span>}
              </div>
              <button onClick={() => deleteMutation.mutate(item.id)} className="text-muted-foreground hover:text-destructive flex-shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-muted-foreground py-8">No hay valores aún</p>}
        </div>
      )}
    </div>
  );
};

export default QuienesSomosPanel;

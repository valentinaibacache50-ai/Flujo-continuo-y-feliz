import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, Users, Upload } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import { uploadImage } from "@/lib/storage";

interface Figura {
  id: string;
  nombre: string;
  posicion: string | null;
  equipo: string | null;
  imagen_url: string | null;
  descripcion: string | null;
  orden: number;
  activo: boolean;
}

const empty: Omit<Figura, "id"> = { nombre: "", posicion: "", equipo: "", imagen_url: "", descripcion: "", orden: 0, activo: true };

const FigurasDestacadasPanel = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Figura | null>(null);
  const [form, setForm] = useState(empty);
  const [creating, setCreating] = useState(false);

  const { data: figuras = [], isLoading } = useQuery({
    queryKey: ["admin_figuras_destacadas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("figuras_destacadas").select("*").order("orden");
      if (error) throw error;
      return data as Figura[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!form.nombre.trim()) throw new Error("El nombre es obligatorio");
      if (editing) {
        const { error } = await supabase.from("figuras_destacadas").update(form).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("figuras_destacadas").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Figura actualizada" : "Figura creada");
      qc.invalidateQueries({ queryKey: ["admin_figuras_destacadas"] });
      setEditing(null);
      setCreating(false);
      setForm(empty);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("figuras_destacadas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Figura eliminada");
      qc.invalidateQueries({ queryKey: ["admin_figuras_destacadas"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const startEdit = (f: Figura) => {
    setEditing(f);
    setCreating(false);
    setForm({ nombre: f.nombre, posicion: f.posicion || "", equipo: f.equipo || "", imagen_url: f.imagen_url || "", descripcion: f.descripcion || "", orden: f.orden, activo: f.activo });
  };

  const startCreate = () => { setCreating(true); setEditing(null); setForm(empty); };
  const cancel = () => { setEditing(null); setCreating(false); setForm(empty); };

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-space font-bold text-foreground">Figuras Destacadas</h2>
        <Button onClick={startCreate} size="sm"><Plus size={16} className="mr-1" /> Agregar</Button>
      </div>

      {(creating || editing) && (
        <Card>
          <CardHeader><CardTitle>{editing ? "Editar figura" : "Nueva figura"}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Nombre *" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
            <Input placeholder="Posición (ej: Delantero)" value={form.posicion || ""} onChange={e => setForm(f => ({ ...f, posicion: e.target.value }))} />
            <Input placeholder="Equipo" value={form.equipo || ""} onChange={e => setForm(f => ({ ...f, equipo: e.target.value }))} />
            <Input placeholder="URL de imagen" value={form.imagen_url || ""} onChange={e => setForm(f => ({ ...f, imagen_url: e.target.value }))} />
            <Textarea placeholder="Descripción (opcional)" value={form.descripcion || ""} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
            <Input type="number" placeholder="Orden" value={form.orden} onChange={e => setForm(f => ({ ...f, orden: Number(e.target.value) }))} />
            <div className="flex items-center gap-2">
              <Switch checked={form.activo} onCheckedChange={v => setForm(f => ({ ...f, activo: v }))} />
              <span className="text-sm text-muted-foreground">Activo</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => save.mutate()} disabled={save.isPending}>
                {save.isPending ? <Loader2 size={16} className="animate-spin mr-1" /> : <Save size={16} className="mr-1" />}
                Guardar
              </Button>
              <Button variant="outline" onClick={cancel}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {figuras.length === 0 && !creating ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay figuras destacadas. ¡Agregá la primera!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {figuras.map(f => (
            <div key={f.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${!f.activo ? 'opacity-50' : ''} ${editing?.id === f.id ? 'border-primary bg-primary/5' : 'border-border bg-card'}`} onClick={() => startEdit(f)}>
              {f.imagen_url ? (
                <SafeImage src={f.imagen_url} alt={f.nombre} className="w-12 h-12 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Users size={16} className="text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{f.nombre}</p>
                <p className="text-xs text-muted-foreground truncate">{[f.posicion, f.equipo].filter(Boolean).join(" · ") || "Sin datos"}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); if (confirm("¿Eliminar esta figura?")) remove.mutate(f.id); }}>
                <Trash2 size={16} className="text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FigurasDestacadasPanel;

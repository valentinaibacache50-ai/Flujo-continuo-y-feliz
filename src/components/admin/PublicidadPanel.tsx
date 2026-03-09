import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/storage";

interface Publicidad {
  id: string;
  titulo: string;
  imagen_url: string | null;
  enlace_url: string | null;
  activo: boolean;
  orden: number;
}

const PublicidadPanel = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Publicidad>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: anuncios, isLoading } = useQuery({
    queryKey: ["admin_publicidad"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publicidad")
        .select("*")
        .order("orden", { ascending: true });
      if (error) throw error;
      return data as Publicidad[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Publicidad> & { imageFile?: File }) => {
      let imagen_url = data.imagen_url;
      if (data.imageFile) {
        imagen_url = await uploadFile(data.imageFile, "imagenes", "publicidad");
      }
      const { error } = await supabase.from("publicidad").insert({
        titulo: data.titulo || "Nuevo anuncio",
        imagen_url,
        enlace_url: data.enlace_url,
        activo: data.activo ?? true,
        orden: data.orden ?? 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_publicidad"] });
      queryClient.invalidateQueries({ queryKey: ["publicidad"] });
      toast.success("Anuncio creado");
      setCreating(false);
      setForm({});
      setImageFile(null);
    },
    onError: () => toast.error("Error al crear anuncio"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, imageFile }: { id: string; data: Partial<Publicidad>; imageFile?: File }) => {
      let imagen_url = data.imagen_url;
      if (imageFile) {
        imagen_url = await uploadFile(imageFile, "imagenes", "publicidad");
      }
      const { error } = await supabase
        .from("publicidad")
        .update({ ...data, imagen_url })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_publicidad"] });
      queryClient.invalidateQueries({ queryKey: ["publicidad"] });
      toast.success("Anuncio actualizado");
      setEditingId(null);
      setForm({});
      setImageFile(null);
    },
    onError: () => toast.error("Error al actualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("publicidad").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_publicidad"] });
      queryClient.invalidateQueries({ queryKey: ["publicidad"] });
      toast.success("Anuncio eliminado");
    },
    onError: () => toast.error("Error al eliminar"),
  });

  const handleEdit = (anuncio: Publicidad) => {
    setEditingId(anuncio.id);
    setForm(anuncio);
    setImageFile(null);
  };

  const handleSave = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form, imageFile: imageFile || undefined });
    }
  };

  const handleCreate = () => {
    createMutation.mutate({ ...form, imageFile: imageFile || undefined });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Gestión de Publicidad</h2>
        <Button onClick={() => setCreating(true)} disabled={creating}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo anuncio
        </Button>
      </div>

      {creating && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nuevo anuncio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={form.titulo || ""}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Nombre del anuncio"
              />
            </div>
            <div>
              <Label>Imagen</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <Label>Enlace (URL)</Label>
              <Input
                value={form.enlace_url || ""}
                onChange={(e) => setForm({ ...form, enlace_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.activo ?? true}
                onCheckedChange={(checked) => setForm({ ...form, activo: checked })}
              />
              <Label>Activo</Label>
            </div>
            <div>
              <Label>Orden</Label>
              <Input
                type="number"
                value={form.orden ?? 0}
                onChange={(e) => setForm({ ...form, orden: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                <span className="ml-2">Guardar</span>
              </Button>
              <Button variant="outline" onClick={() => { setCreating(false); setForm({}); setImageFile(null); }}>
                <X className="h-4 w-4 mr-2" /> Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {anuncios?.map((anuncio) => (
          <Card key={anuncio.id}>
            <CardContent className="p-4">
              {editingId === anuncio.id ? (
                <div className="space-y-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={form.titulo || ""}
                      onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Imagen</Label>
                    {form.imagen_url && (
                      <img src={form.imagen_url} alt="" className="w-32 h-20 object-cover rounded mb-2" />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div>
                    <Label>Enlace (URL)</Label>
                    <Input
                      value={form.enlace_url || ""}
                      onChange={(e) => setForm({ ...form, enlace_url: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.activo ?? true}
                      onCheckedChange={(checked) => setForm({ ...form, activo: checked })}
                    />
                    <Label>Activo</Label>
                  </div>
                  <div>
                    <Label>Orden</Label>
                    <Input
                      type="number"
                      value={form.orden ?? 0}
                      onChange={(e) => setForm({ ...form, orden: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      <span className="ml-2">Guardar</span>
                    </Button>
                    <Button variant="outline" onClick={() => { setEditingId(null); setForm({}); setImageFile(null); }}>
                      <X className="h-4 w-4 mr-2" /> Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {anuncio.imagen_url ? (
                    <img src={anuncio.imagen_url} alt="" className="w-24 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-24 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                      Sin imagen
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{anuncio.titulo}</p>
                    <p className="text-sm text-muted-foreground truncate">{anuncio.enlace_url || "Sin enlace"}</p>
                    <p className="text-xs text-muted-foreground">
                      {anuncio.activo ? "✓ Activo" : "Inactivo"} · Orden: {anuncio.orden}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(anuncio)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(anuncio.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {(!anuncios || anuncios.length === 0) && (
          <p className="text-center text-muted-foreground py-8">No hay anuncios configurados.</p>
        )}
      </div>
    </div>
  );
};

export default PublicidadPanel;

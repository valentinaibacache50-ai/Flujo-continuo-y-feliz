import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2, X, Check, Loader2, ExternalLink, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/storage";

type Posicion =
  | "carrusel"
  | "banner_fijo"
  | "entre_noticias"
  | "ficha-jugador"
  | "articulo-inicio"
  | "articulo-final"
  | "estadisticas-entre-tablas"
  | "video-bajo-reproductor"
  | "popup";

const POSICION_LABELS: Record<Posicion, string> = {
  carrusel: "Carrusel de sponsors",
  banner_fijo: "Banner fijo inferior",
  entre_noticias: "Entre noticias (grid)",
  "ficha-jugador": "Ficha jugador — debajo de la foto",
  "articulo-inicio": "Artículo — entre párrafo 2 y 3",
  "articulo-final": "Artículo — al final del contenido",
  "estadisticas-entre-tablas": "Estadísticas — entre tablas",
  "video-bajo-reproductor": "Video — debajo del reproductor",
  popup: "Popup — aparece a los 5 segundos",
};

interface Publicidad {
  id: string;
  titulo: string;
  imagen_url: string | null;
  enlace_url: string | null;
  activo: boolean;
  orden: number;
  posicion: Posicion;
}

const invalidateAll = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ["admin_publicidad"] });
  qc.invalidateQueries({ queryKey: ["publicidad"] });
  qc.invalidateQueries({ queryKey: ["publicidad_banner_fijo"] });
  qc.invalidateQueries({ queryKey: ["publicidad_entre_noticias"] });
  // invalidate all ad_banner queries
  qc.invalidateQueries({ queryKey: ["ad_banner"] });
};

const emptyForm = (): Partial<Publicidad> => ({
  titulo: "",
  enlace_url: "",
  activo: true,
  orden: 0,
  posicion: "carrusel",
});

const AdForm = ({
  form,
  setForm,
  imageFile,
  setImageFile,
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: {
  form: Partial<Publicidad>;
  setForm: (f: Partial<Publicidad>) => void;
  imageFile: File | null;
  setImageFile: (f: File | null) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          value={form.titulo || ""}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          placeholder="Nombre del anuncio"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="posicion">Posición</Label>
        <Select
          value={form.posicion ?? "carrusel"}
          onValueChange={(value) => setForm({ ...form, posicion: value as Posicion })}
        >
          <SelectTrigger id="posicion">
            <SelectValue placeholder="Seleccionar posición" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(POSICION_LABELS).map(([val, label]) => (
              <SelectItem key={val} value={val}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="space-y-1.5">
      <Label htmlFor="enlace">Enlace (URL)</Label>
      <Input
        id="enlace"
        value={form.enlace_url || ""}
        onChange={(e) => setForm({ ...form, enlace_url: e.target.value })}
        placeholder="https://..."
        type="url"
      />
    </div>

    <div className="space-y-1.5">
      <Label>Imagen</Label>
      {form.imagen_url && !imageFile && (
        <div className="mb-2">
          <img src={form.imagen_url} alt="" className="h-16 rounded border border-border object-cover" />
        </div>
      )}
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="cursor-pointer"
      />
      {imageFile && (
        <p className="text-xs text-muted-foreground">Nueva imagen seleccionada: {imageFile.name}</p>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="orden">Orden</Label>
        <Input
          id="orden"
          type="number"
          value={form.orden ?? 0}
          onChange={(e) => setForm({ ...form, orden: parseInt(e.target.value) || 0 })}
        />
      </div>
      <div className="flex items-end pb-0.5">
        <div className="flex items-center gap-2">
          <Switch
            id="activo"
            checked={form.activo ?? true}
            onCheckedChange={(checked) => setForm({ ...form, activo: checked })}
          />
          <Label htmlFor="activo">Activo</Label>
        </div>
      </div>
    </div>

    <div className="flex gap-2 pt-2">
      <Button onClick={onSubmit} disabled={isPending} className="flex-1 sm:flex-none">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
        {submitLabel}
      </Button>
      <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">
        <X className="h-4 w-4 mr-2" /> Cancelar
      </Button>
    </div>
  </div>
);

const PublicidadPanel = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Publicidad>>(emptyForm());
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
    mutationFn: async (payload: Partial<Publicidad> & { imageFile?: File }) => {
      let imagen_url = payload.imagen_url ?? null;
      if (payload.imageFile) {
        imagen_url = await uploadImage(payload.imageFile, "publicidad");
      }
      const { error } = await supabase.from("publicidad").insert({
        titulo: payload.titulo?.trim() || "Nuevo anuncio",
        imagen_url,
        enlace_url: payload.enlace_url?.trim() || null,
        activo: payload.activo ?? true,
        orden: payload.orden ?? 0,
        posicion: payload.posicion ?? "carrusel",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll(queryClient);
      toast.success("Anuncio creado");
      setCreating(false);
      setForm(emptyForm());
      setImageFile(null);
    },
    onError: (error: any) => toast.error(error?.message || "Error al crear anuncio"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, imageFile }: { id: string; data: Partial<Publicidad>; imageFile?: File }) => {
      let imagen_url = data.imagen_url ?? null;
      if (imageFile) {
        imagen_url = await uploadImage(imageFile, "publicidad");
      }
      const { error } = await supabase
        .from("publicidad")
        .update({
          titulo: data.titulo?.trim() || "Anuncio",
          imagen_url,
          enlace_url: data.enlace_url?.trim() || null,
          activo: data.activo ?? true,
          orden: data.orden ?? 0,
          posicion: data.posicion ?? "carrusel",
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll(queryClient);
      toast.success("Anuncio actualizado");
      setEditingId(null);
      setForm(emptyForm());
      setImageFile(null);
    },
    onError: (error: any) => toast.error(error?.message || "Error al actualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("publicidad").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll(queryClient);
      toast.success("Anuncio eliminado");
    },
    onError: (error: any) => toast.error(error?.message || "Error al eliminar"),
  });

  const handleEdit = (anuncio: Publicidad) => {
    setEditingId(anuncio.id);
    setForm({ ...anuncio });
    setImageFile(null);
    setCreating(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm());
    setImageFile(null);
  };

  const handleCancelCreate = () => {
    setCreating(false);
    setForm(emptyForm());
    setImageFile(null);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Publicidad</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{anuncios?.length ?? 0} anuncio{anuncios?.length !== 1 ? "s" : ""}</p>
        </div>
        <Button
          onClick={() => { setCreating(true); setEditingId(null); setForm(emptyForm()); setImageFile(null); }}
          disabled={creating}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Nuevo anuncio
        </Button>
      </div>

      {/* Create form */}
      {creating && (
        <Card className="border-primary/30">
          <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
            <CardTitle className="text-base">Nuevo anuncio</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-5">
            <AdForm
              form={form}
              setForm={setForm}
              imageFile={imageFile}
              setImageFile={setImageFile}
              onSubmit={() => createMutation.mutate({ ...form, imageFile: imageFile || undefined })}
              onCancel={handleCancelCreate}
              isPending={createMutation.isPending}
              submitLabel="Crear anuncio"
            />
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="space-y-3">
        {anuncios?.map((anuncio) => (
          <Card key={anuncio.id} className={editingId === anuncio.id ? "border-primary/40" : ""}>
            <CardContent className="p-4 sm:p-5">
              {editingId === anuncio.id ? (
                <>
                  <p className="text-sm font-medium text-foreground mb-4">Editando: <span className="text-primary">{anuncio.titulo}</span></p>
                  <AdForm
                    form={form}
                    setForm={setForm}
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    onSubmit={() => updateMutation.mutate({ id: editingId, data: form, imageFile: imageFile || undefined })}
                    onCancel={handleCancelEdit}
                    isPending={updateMutation.isPending}
                    submitLabel="Guardar cambios"
                  />
                </>
              ) : (
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    {anuncio.imagen_url ? (
                      <img src={anuncio.imagen_url} alt="" className="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded-lg border border-border" />
                    ) : (
                      <div className="w-20 h-14 sm:w-24 sm:h-16 bg-muted rounded-lg border border-border flex items-center justify-center">
                        <ImageOff className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-foreground text-sm leading-tight truncate">{anuncio.titulo}</p>
                      {/* Action buttons */}
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(anuncio)}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteMutation.mutate(anuncio.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {anuncio.enlace_url && (
                      <a
                        href={anuncio.enlace_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5 max-w-full"
                      >
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{anuncio.enlace_url}</span>
                      </a>
                    )}

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <Badge variant={anuncio.activo ? "default" : "secondary"} className="text-[10px] px-1.5 py-0 h-4">
                        {anuncio.activo ? "Activo" : "Inactivo"}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-primary border-primary/30">
                        {POSICION_LABELS[anuncio.posicion as Posicion] ?? anuncio.posicion}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">Orden: {anuncio.orden}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {(!anuncios || anuncios.length === 0) && !creating && (
          <div className="text-center py-12 text-muted-foreground">
            <ImageOff className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No hay anuncios configurados</p>
            <p className="text-xs mt-1">Hacé clic en "Nuevo anuncio" para empezar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicidadPanel;

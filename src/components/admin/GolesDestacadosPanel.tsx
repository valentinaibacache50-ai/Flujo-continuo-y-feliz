import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, Goal, Upload } from "lucide-react";
import { uploadImage, uploadProgramVideo } from "@/lib/storage";

interface Gol {
  id: string;
  titulo: string;
  descripcion: string | null;
  video_url: string;
  miniatura_url: string | null;
  orden: number;
  activo: boolean;
}

const empty: Omit<Gol, "id"> = { titulo: "", descripcion: "", video_url: "", miniatura_url: "", orden: 0, activo: true };

const GolesDestacadosPanel = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Gol | null>(null);
  const [form, setForm] = useState(empty);
  const [creating, setCreating] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    setVideoProgress(0);
    try {
      const url = await uploadProgramVideo(file, (p) => setVideoProgress(p));
      setForm(f => ({ ...f, video_url: url }));
      toast.success("Video subido");
    } catch (err: any) {
      toast.error(err.message || "Error al subir video");
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    try {
      const url = await uploadImage(file, "goles-miniaturas");
      setForm(f => ({ ...f, miniatura_url: url }));
      toast.success("Miniatura subida");
    } catch (err: any) {
      toast.error(err.message || "Error al subir miniatura");
    } finally {
      setUploadingThumb(false);
      if (thumbInputRef.current) thumbInputRef.current.value = "";
    }
  };

  const { data: goles = [], isLoading } = useQuery({
    queryKey: ["admin_goles_destacados"],
    queryFn: async () => {
      const { data, error } = await supabase.from("goles_destacados").select("*").order("orden");
      if (error) throw error;
      return data as Gol[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!form.titulo.trim() || !form.video_url.trim()) throw new Error("Título y URL de video son obligatorios");
      if (editing) {
        const { error } = await supabase.from("goles_destacados").update(form).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("goles_destacados").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Gol actualizado" : "Gol creado");
      qc.invalidateQueries({ queryKey: ["admin_goles_destacados"] });
      setEditing(null);
      setCreating(false);
      setForm(empty);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("goles_destacados").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Gol eliminado");
      qc.invalidateQueries({ queryKey: ["admin_goles_destacados"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const startEdit = (g: Gol) => {
    setEditing(g);
    setCreating(false);
    setForm({ titulo: g.titulo, descripcion: g.descripcion || "", video_url: g.video_url, miniatura_url: g.miniatura_url || "", orden: g.orden, activo: g.activo });
  };

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm(empty);
  };

  const cancel = () => { setEditing(null); setCreating(false); setForm(empty); };

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-space font-bold text-foreground">Goles Destacados</h2>
        <Button onClick={startCreate} size="sm"><Plus size={16} className="mr-1" /> Agregar</Button>
      </div>

      {(creating || editing) && (
        <Card>
          <CardHeader><CardTitle>{editing ? "Editar gol" : "Nuevo gol"}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Título *" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Video *</label>
              <div className="flex gap-2">
                <Input placeholder="URL del video (YouTube o directo)" value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} className="flex-1" />
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                <Button type="button" variant="outline" size="sm" disabled={uploadingVideo} onClick={() => videoInputRef.current?.click()}>
                  {uploadingVideo ? <><Loader2 size={14} className="animate-spin mr-1" />{videoProgress}%</> : <><Upload size={14} className="mr-1" />Subir</>}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Miniatura (opcional)</label>
              <div className="flex gap-2">
                <Input placeholder="URL miniatura" value={form.miniatura_url || ""} onChange={e => setForm(f => ({ ...f, miniatura_url: e.target.value }))} className="flex-1" />
                <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbUpload} />
                <Button type="button" variant="outline" size="sm" disabled={uploadingThumb} onClick={() => thumbInputRef.current?.click()}>
                  {uploadingThumb ? <Loader2 size={14} className="animate-spin" /> : <><Upload size={14} className="mr-1" />Subir</>}
                </Button>
              </div>
            </div>

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

      {goles.length === 0 && !creating ? (
        <div className="text-center py-12">
          <Goal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay goles destacados. ¡Agregá el primero!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {goles.map(g => (
            <div key={g.id} className={`flex items-center justify-between p-3 rounded-lg border ${!g.activo ? 'opacity-50' : ''} ${editing?.id === g.id ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => startEdit(g)}>
                <p className="font-medium text-foreground truncate">{g.titulo}</p>
                <p className="text-xs text-muted-foreground truncate">{g.video_url}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { if (confirm("¿Eliminar este gol?")) remove.mutate(g.id); }}>
                <Trash2 size={16} className="text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GolesDestacadosPanel;

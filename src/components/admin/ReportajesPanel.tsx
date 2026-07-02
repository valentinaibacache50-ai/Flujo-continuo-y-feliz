import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage, uploadProgramVideo } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, Loader2, Image, FileVideo, AlertCircle, Pencil, X } from "lucide-react";

const isVideoFile = (url: string) => /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);

const ReportajesPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [tag, setTag] = useState("Reportaje");
  const [videoUrl, setVideoUrl] = useState("");
  const [fechaPublicacion, setFechaPublicacion] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else { setImagePreview(null); }
  }, [imageFile]);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else { setVideoPreview(null); }
  }, [videoFile]);

  const { data: reportajes = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["reportajes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reportajes").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    retry: 2,
  });

  const resetForm = () => {
    setTitulo(""); setSubtitulo(""); setContenido(""); setTag("Reportaje");
    setVideoUrl(""); setFechaPublicacion(""); setImageFile(null); setVideoFile(null);
    setEditingId(null); setShowForm(false); setUploading(false);
  };

  const startEdit = (r: any) => {
    setEditingId(r.id);
    setTitulo(r.titulo);
    setSubtitulo(r.subtitulo || "");
    setContenido(r.contenido);
    setTag(r.tag);
    setVideoUrl(r.video_url || "");
    setFechaPublicacion(r.fecha_publicacion ? new Date(r.fecha_publicacion).toISOString().slice(0, 10) : "");
    setImageFile(null); setVideoFile(null);
    setShowForm(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      let imagen_url: string | null = null;
      let video_url = videoUrl || null;

      if (imageFile) imagen_url = await uploadImage(imageFile, "reportajes");
      if (videoFile) {
        const uploaded = await uploadProgramVideo(videoFile);
        if (uploaded) video_url = uploaded;
      }

      const payload: any = { titulo, subtitulo: subtitulo || null, contenido, tag, video_url };
      if (imagen_url) payload.imagen_url = imagen_url;
      if (fechaPublicacion) payload.fecha_publicacion = new Date(fechaPublicacion).toISOString();

      if (editingId) {
        const { error } = await supabase.from("reportajes").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        payload.imagen_url = imagen_url;
        const { error } = await supabase.from("reportajes").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportajes"] });
      resetForm();
      toast({ title: editingId ? "Reportaje actualizado" : "Reportaje agregado" });
    },
    onError: (err: any) => { setUploading(false); toast({ title: err?.message || "Error al guardar reportaje", variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reportajes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportajes"] });
      toast({ title: "Reportaje eliminado" });
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground">Gestión de Reportajes</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3 relative">
          <button type="button" onClick={resetForm} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X size={18} /></button>
          <h3 className="text-sm font-semibold text-foreground mb-1">{editingId ? "Editar reportaje" : "Nuevo reportaje"}</h3>
          <input placeholder="Título del reportaje" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          <input placeholder="Subtítulo (opcional)" value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          <textarea placeholder="Contenido del reportaje..." value={contenido} onChange={(e) => setContenido(e.target.value)} rows={6} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" required />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input placeholder="Etiqueta" value={tag} onChange={(e) => setTag(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            <input placeholder="URL de YouTube (opcional)" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            <input type="date" value={fechaPublicacion} onChange={(e) => setFechaPublicacion(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 px-4 py-3 bg-secondary border border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
              <Upload size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">{imageFile ? imageFile.name : editingId ? "Reemplazar imagen (opcional)" : "Subir imagen"}</span>
              <input type="file" accept="image/*" onChange={(e) => { setImageFile(e.target.files?.[0] || null); setVideoFile(null); }} className="hidden" />
            </label>
            <label className="flex items-center gap-2 px-4 py-3 bg-secondary border border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
              <FileVideo size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">{videoFile ? videoFile.name : editingId ? "Reemplazar video (opcional)" : "Subir video (.mp4)"}</span>
              <input type="file" accept="video/*" onChange={(e) => { setVideoFile(e.target.files?.[0] || null); setImageFile(null); }} className="hidden" />
            </label>
          </div>
          {(imagePreview || videoPreview) && (
            <div className="rounded-lg overflow-hidden border border-border max-w-xs">
              {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />}
              {videoPreview && <video src={videoPreview} controls className="w-full h-32 object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />}
            </div>
          )}
          <button type="submit" disabled={uploading} className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
            {uploading && <Loader2 size={14} className="animate-spin" />}
            {editingId ? "Actualizar" : "Guardar"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : isError ? (
        <div className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <p className="text-muted-foreground text-sm mb-3">Error al cargar reportajes</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">Reintentar</button>
        </div>
      ) : (
        <div className="space-y-3">
          {reportajes.map((r) => {
            const hasVideo = r.imagen_url && isVideoFile(r.imagen_url);
            return (
              <div key={r.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {hasVideo ? (
                    <video src={r.imagen_url!} muted preload="metadata" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" onError={(e) => (e.currentTarget.style.display = "none")} />
                  ) : r.imagen_url ? (
                    <img src={r.imagen_url} alt={r.titulo} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" onError={(e) => (e.currentTarget.style.display = "none")} />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <Image size={16} className="text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-foreground font-medium truncate">{r.titulo}</h3>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                      <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">{r.tag}</span>
                      {r.subtitulo && <span className="truncate">{r.subtitulo}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => startEdit(r)} className="text-muted-foreground hover:text-primary p-1"><Pencil size={15} /></button>
                  <button onClick={() => deleteMutation.mutate(r.id)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
          {reportajes.length === 0 && <p className="text-center text-muted-foreground py-8">No hay reportajes aún</p>}
        </div>
      )}
    </div>
  );
};

export default ReportajesPanel;

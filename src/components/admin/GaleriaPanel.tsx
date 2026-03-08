import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, Loader2, Image, Play, Video, AlertCircle, Pencil, X } from "lucide-react";

const isVideoFile = (url: string) => /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);
const isVideoFileObj = (file: File) => file.type.startsWith("video/");

const GaleriaPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("Foto");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [fechaPublicacion, setFechaPublicacion] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const { data: items = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["galeria"],
    queryFn: async () => {
      const { data, error } = await supabase.from("galeria").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    retry: 2,
  });

  const resetForm = () => {
    setTitulo(""); setTipo("Foto"); setImageFile(null); setVideoUrl(""); setFechaPublicacion("");
    setEditingId(null); setShowForm(false); setUploading(false);
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setTitulo(item.titulo);
    setTipo(item.tipo);
    setVideoUrl(item.video_url || "");
    setFechaPublicacion(item.fecha_publicacion ? new Date(item.fecha_publicacion).toISOString().slice(0, 10) : "");
    setImageFile(null);
    setShowForm(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      let imagen_url: string | null = null;
      if (imageFile) {
        imagen_url = await uploadImage(imageFile, "galeria");
      }

      const payload: any = { titulo, tipo };
      if (imagen_url) payload.imagen_url = imagen_url;
      if (tipo === "Video" && videoUrl.trim()) payload.video_url = videoUrl.trim();
      if (fechaPublicacion) payload.fecha_publicacion = new Date(fechaPublicacion).toISOString();

      if (editingId) {
        const { error } = await supabase.from("galeria").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("galeria").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galeria"] });
      resetForm();
      toast({ title: editingId ? "Elemento actualizado" : "Elemento agregado a galería" });
    },
    onError: () => { setUploading(false); toast({ title: "Error al guardar", variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("galeria").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galeria"] });
      toast({ title: "Eliminado" });
    },
  });

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^?&\s]+)/);
    return match?.[1] || null;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground">Gestión de Galería</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
          <Plus size={16} /> Subir
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3 relative">
          <button type="button" onClick={resetForm} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X size={18} /></button>
          <h3 className="text-sm font-semibold text-foreground mb-1">{editingId ? "Editar elemento" : "Nuevo elemento"}</h3>
          <input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          <div className="grid grid-cols-2 gap-3">
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary">
              <option value="Foto">Foto</option>
              <option value="Video">Video</option>
            </select>
            <input type="date" value={fechaPublicacion} onChange={(e) => setFechaPublicacion(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          {tipo === "Video" && (
            <input placeholder="URL de YouTube" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          )}
          <label className="flex items-center gap-2 px-4 py-3 bg-secondary border border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
            <Upload size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{imageFile ? imageFile.name : editingId ? "Reemplazar archivo (opcional)" : "Seleccionar archivo"}</span>
            <input type="file" accept={tipo === "Video" ? "image/*,video/mp4,video/webm,video/quicktime" : "image/*"} onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
          {previewUrl && imageFile && imageFile.type.startsWith("image/") && (
            <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg" onError={(e) => (e.currentTarget.style.display = "none")} />
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
          <p className="text-muted-foreground text-sm mb-3">Error al cargar la galería</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">Reintentar</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden group relative">
              {item.imagen_url && isVideoFile(item.imagen_url) ? (
                <div className="relative">
                  <video src={item.imagen_url} preload="metadata" muted className="w-full aspect-square object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center"><Play size={18} className="text-primary-foreground ml-0.5" /></div>
                  </div>
                </div>
              ) : item.imagen_url ? (
                <div className="relative">
                  <img src={item.imagen_url} alt={item.titulo} className="w-full aspect-square object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                  {item.tipo === "Video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center"><Play size={18} className="text-primary-foreground ml-0.5" /></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-square bg-secondary flex items-center justify-center">
                  <Image size={32} className="text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <h3 className="text-foreground text-sm font-medium truncate">{item.titulo}</h3>
                <span className="text-xs text-primary">{item.tipo}</span>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(item)} className="p-1.5 bg-background/60 rounded-lg text-muted-foreground hover:text-primary">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteMutation.mutate(item.id)} className="p-1.5 bg-background/60 rounded-lg text-muted-foreground hover:text-destructive">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-8">No hay elementos en la galería</div>
          )}
        </div>
      )}
    </div>
  );
};

export default GaleriaPanel;

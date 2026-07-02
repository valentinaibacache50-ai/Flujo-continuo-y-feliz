import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";

const CronicasPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [tag, setTag] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Crónicas are stored as noticias with specific tags
  const { data: cronicas = [], isLoading } = useQuery({
    queryKey: ["noticias", "cronicas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("noticias").select("*")
        .or("tag.ilike.%crónica%,tag.ilike.%análisis%,tag.ilike.%contenido%")
        .order("fecha", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      let imagen_url = null;
      if (imageFile) imagen_url = await uploadImage(imageFile, "cronicas");
      const { error } = await supabase.from("noticias").insert({ titulo, tag, descripcion, imagen_url });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noticias"] });
      setTitulo(""); setTag(""); setDescripcion(""); setImageFile(null);
      setShowForm(false); setUploading(false);
      toast({ title: "Crónica publicada" });
    },
    onError: (err: any) => { setUploading(false); toast({ title: err?.message || "Error al publicar crónica", variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("noticias").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noticias"] });
      toast({ title: "Eliminada" });
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground">Gestión de Crónicas</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
          <Plus size={16} /> Nueva
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate(); }} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3">
          <input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          <input placeholder="Etiqueta (Crónica Sub-12, Análisis, etc.)" value={tag} onChange={(e) => setTag(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          <textarea placeholder="Contenido de la crónica..." rows={5} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" required />
          <label className="flex items-center gap-2 px-4 py-3 bg-secondary border border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
            <Upload size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{imageFile ? imageFile.name : "Imagen de portada (opcional)"}</span>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
          <button type="submit" disabled={uploading} className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
            {uploading && <Loader2 size={14} className="animate-spin" />}
            Publicar
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {cronicas.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="text-foreground font-medium">{c.titulo}</h3>
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">{c.tag}</span>
                  <span>{new Date(c.fecha).toLocaleDateString()}</span>
                </div>
              </div>
              <button onClick={() => deleteMutation.mutate(c.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {cronicas.length === 0 && <p className="text-center text-muted-foreground py-8">No hay crónicas aún</p>}
        </div>
      )}
    </div>
  );
};

export default CronicasPanel;

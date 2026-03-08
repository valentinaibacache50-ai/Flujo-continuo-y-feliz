import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, Loader2, Image, Pencil, X } from "lucide-react";

const NoticiasPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [tag, setTag] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: noticias = [], isLoading } = useQuery({
    queryKey: ["noticias"],
    queryFn: async () => {
      const { data, error } = await supabase.from("noticias").select("*").order("fecha", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setTitulo(""); setTag(""); setDescripcion(""); setFecha(""); setImageFile(null);
    setEditingId(null); setShowForm(false); setUploading(false);
  };

  const startEdit = (n: any) => {
    setEditingId(n.id);
    setTitulo(n.titulo);
    setTag(n.tag);
    setDescripcion(n.descripcion || "");
    setFecha(n.fecha ? new Date(n.fecha).toISOString().slice(0, 10) : "");
    setImageFile(null);
    setShowForm(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      let imagen_url: string | null = null;
      if (imageFile) imagen_url = await uploadImage(imageFile, "noticias");

      const payload: any = { titulo, tag, descripcion };
      if (imagen_url) payload.imagen_url = imagen_url;
      if (fecha) payload.fecha = new Date(fecha).toISOString();

      if (editingId) {
        const { error } = await supabase.from("noticias").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("noticias").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noticias"] });
      resetForm();
      toast({ title: editingId ? "Noticia actualizada" : "Noticia agregada" });
    },
    onError: () => { setUploading(false); toast({ title: "Error al guardar", variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("noticias").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noticias"] });
      toast({ title: "Noticia eliminada" });
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground">Gestión de Noticias</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
          <Plus size={16} /> Nueva
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3 relative">
          <button type="button" onClick={resetForm} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X size={18} /></button>
          <h3 className="text-sm font-semibold text-foreground mb-1">{editingId ? "Editar noticia" : "Nueva noticia"}</h3>
          <input placeholder="Título de la noticia" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Etiqueta (Crónica, Estadísticas, etc.)" value={tag} onChange={(e) => setTag(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" />
          <label className="flex items-center gap-2 px-4 py-3 bg-secondary border border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
            <Upload size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{imageFile ? imageFile.name : editingId ? "Reemplazar imagen (opcional)" : "Subir imagen destacada"}</span>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
          <button type="submit" disabled={uploading} className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
            {uploading && <Loader2 size={14} className="animate-spin" />}
            {editingId ? "Actualizar" : "Guardar"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {noticias.map((n) => (
            <div key={n.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {n.imagen_url ? (
                  <img src={n.imagen_url} alt={n.titulo} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Image size={16} className="text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-foreground font-medium truncate">{n.titulo}</h3>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">{n.tag}</span>
                    <span>{new Date(n.fecha).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => startEdit(n)} className="text-muted-foreground hover:text-primary p-1"><Pencil size={15} /></button>
                <button onClick={() => deleteMutation.mutate(n.id)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {noticias.length === 0 && <p className="text-center text-muted-foreground py-8">No hay noticias aún</p>}
        </div>
      )}
    </div>
  );
};

export default NoticiasPanel;

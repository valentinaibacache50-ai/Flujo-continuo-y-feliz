import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, Loader2, Image } from "lucide-react";

const GaleriaPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("Foto");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["galeria"],
    queryFn: async () => {
      const { data, error } = await supabase.from("galeria").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      let imagen_url = null;
      if (imageFile) {
        imagen_url = await uploadImage(imageFile, "galeria");
      }
      const { error } = await supabase.from("galeria").insert({ titulo, tipo, imagen_url });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galeria"] });
      setTitulo(""); setImageFile(null);
      setShowForm(false); setUploading(false);
      toast({ title: "Elemento agregado a galería" });
    },
    onError: () => { setUploading(false); toast({ title: "Error al agregar", variant: "destructive" }); },
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground">Gestión de Galería</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
          <Plus size={16} /> Subir
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate(); }} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3">
          <input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary">
            <option value="Foto">Foto</option>
            <option value="Video">Video</option>
          </select>
          <label className="flex items-center gap-2 px-4 py-3 bg-secondary border border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
            <Upload size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{imageFile ? imageFile.name : "Seleccionar imagen o video"}</span>
            <input type="file" accept="image/*,video/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
          {imageFile && imageFile.type.startsWith("image/") && (
            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
          )}
          <button type="submit" disabled={uploading} className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
            {uploading && <Loader2 size={14} className="animate-spin" />}
            Guardar
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden group relative">
              {item.imagen_url ? (
                <img src={item.imagen_url} alt={item.titulo} className="w-full aspect-square object-cover" />
              ) : (
                <div className="w-full aspect-square bg-secondary flex items-center justify-center">
                  <Image size={32} className="text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <h3 className="text-foreground text-sm font-medium truncate">{item.titulo}</h3>
                <span className="text-xs text-primary">{item.tipo}</span>
              </div>
              <button
                onClick={() => deleteMutation.mutate(item.id)}
                className="absolute top-2 right-2 p-1.5 bg-background/60 rounded-lg text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
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

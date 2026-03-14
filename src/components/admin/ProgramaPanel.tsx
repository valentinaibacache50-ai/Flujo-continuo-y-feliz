import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, Loader2, X, Tv, Play, Upload } from "lucide-react";

const getYoutubeId = (url: string): string | null => {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
};

const getThumb = (ep: any) => {
  if (ep.miniatura_url) return ep.miniatura_url;
  const ytId = getYoutubeId(ep.video_url ?? "");
  return ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;
};

const EpisodeForm = ({ episode, onSave, onCancel }: { episode?: any; onSave: () => void; onCancel: () => void }) => {
  const { toast } = useToast();
  const [titulo, setTitulo] = useState(episode?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(episode?.descripcion ?? "");
  const [videoUrl, setVideoUrl] = useState(episode?.video_url ?? "");
  const [temporada, setTemporada] = useState(episode?.temporada ?? 1);
  const [episodio, setEpisodio] = useState(episode?.episodio ?? 1);
  const [duracion, setDuracion] = useState(episode?.duracion ?? "");
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [activo, setActivo] = useState(episode?.activo ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let miniatura_url = episode?.miniatura_url ?? null;
      if (thumbFile) miniatura_url = await uploadImage(thumbFile, "programa");

      const payload = {
        titulo, descripcion: descripcion || null, video_url: videoUrl,
        miniatura_url, temporada, episodio, duracion: duracion || "00:00", activo,
      };

      if (episode) {
        const { error } = await supabase.from("programa_episodios").update(payload).eq("id", episode.id);
        if (error) throw error;
        toast({ title: "Episodio actualizado" });
      } else {
        const { error } = await supabase.from("programa_episodios").insert(payload);
        if (error) throw error;
        toast({ title: "Episodio creado" });
      }
      onSave();
    } catch (err: any) {
      toast({ title: `Error: ${err?.message}`, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3 relative">
      <button type="button" onClick={onCancel} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X size={18} /></button>
      <h3 className="text-sm font-semibold text-foreground">{episode ? "Editar episodio" : "Nuevo episodio"}</h3>

      <input placeholder="Título *" value={titulo} onChange={(e) => setTitulo(e.target.value)} required
        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />

      <input placeholder="URL del video (YouTube o MP4) *" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required
        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />

      <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2}
        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" />

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Temporada</label>
          <input type="number" min={1} value={temporada} onChange={(e) => setTemporada(Number(e.target.value))}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Episodio</label>
          <input type="number" min={1} value={episodio} onChange={(e) => setEpisodio(Number(e.target.value))}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Duración</label>
          <input placeholder="ej: 45:00" value={duracion} onChange={(e) => setDuracion(e.target.value)}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
          <Upload size={14} />
          <span>{thumbFile ? thumbFile.name : "Miniatura (opcional)"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)} />
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} className="accent-primary" />
          <span className="text-muted-foreground">Activo</span>
        </label>
      </div>

      <button type="submit" disabled={saving}
        className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
        {saving && <Loader2 size={14} className="animate-spin" />}
        {episode ? "Guardar cambios" : "Crear episodio"}
      </button>
    </form>
  );
};

const ProgramaPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const { data: episodios = [], isLoading } = useQuery({
    queryKey: ["admin_programa"],
    queryFn: async () => {
      const { data, error } = await supabase.from("programa_episodios").select("*").order("temporada", { ascending: false }).order("episodio", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este episodio?")) return;
    const { error } = await supabase.from("programa_episodios").delete().eq("id", id);
    if (error) toast({ title: "Error al eliminar", variant: "destructive" });
    else queryClient.invalidateQueries({ queryKey: ["admin_programa"] });
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    queryClient.invalidateQueries({ queryKey: ["admin_programa"] });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground flex items-center gap-2">
          <Tv size={22} /> Programa
        </h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90">
          <Plus size={16} /> Nuevo episodio
        </button>
      </div>

      {(showForm || editing) && (
        <EpisodeForm episode={editing} onSave={handleSaved} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={24} /></div>
      ) : episodios.length === 0 ? (
        <p className="text-muted-foreground text-center py-10">No hay episodios cargados aún.</p>
      ) : (
        <div className="space-y-3">
          {episodios.map((ep) => {
            const thumb = getThumb(ep);
            return (
              <div key={ep.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-3">
                <div className="w-28 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0 relative">
                  {thumb ? (
                    <img src={thumb} alt={ep.titulo} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Play size={18} className="text-muted-foreground" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium text-sm truncate">{ep.titulo}</p>
                  <p className="text-muted-foreground text-xs">
                    T{ep.temporada} · E{ep.episodio} {ep.duracion && ep.duracion !== "00:00" ? `· ${ep.duracion}` : ""}
                  </p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ep.activo ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                    {ep.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => { setEditing(ep); setShowForm(false); }} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(ep.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProgramaPanel;

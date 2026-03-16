import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, Loader2, X, Tv, Play, Upload, Eye, Image } from "lucide-react";

import VideoThumbnail from "@/components/VideoThumbnail";
import { getYoutubeId, getYoutubeThumbnail, isDirectVideoFile } from "@/lib/video-utils";

const getThumb = (ep: any) => {
  if (ep.miniatura_url) return ep.miniatura_url;
  return getYoutubeThumbnail(ep.video_url);
};

const isDirectVideo = (url?: string | null) => isDirectVideoFile(url);

const EpisodeForm = ({ episode, onSave, onCancel }: { episode?: any; onSave: () => void; onCancel: () => void }) => {
  const { toast } = useToast();
  const [titulo, setTitulo] = useState(episode?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(episode?.descripcion ?? "");
  const [videoUrl, setVideoUrl] = useState(episode?.video_url ?? "");
  const [temporada, setTemporada] = useState(episode?.temporada ?? 1);
  const [episodio, setEpisodio] = useState(episode?.episodio ?? 1);
  const [duracion, setDuracion] = useState(episode?.duracion ?? "");
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [activo, setActivo] = useState(episode?.activo ?? true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Preview for current thumbnail
  const currentThumb = getThumb(episode ?? { video_url: videoUrl });

  const handleVideoFileChange = async (file: File) => {
    setVideoFile(file);
    setUploadingVideo(true);
    try {
      const url = await uploadImage(file, "programa-videos");
      setVideoUrl(url);
      toast({ title: "Video subido ✓" });
    } catch (err: any) {
      toast({ title: `Error al subir video: ${err?.message}`, variant: "destructive" });
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const normalizedVideoUrl = videoUrl.trim();
    const isYoutube = !!getYoutubeId(normalizedVideoUrl);
    const isDirect = isDirectVideo(normalizedVideoUrl);

    if (!normalizedVideoUrl) {
      toast({ title: "Debes cargar una URL de video", variant: "destructive" });
      setSaving(false);
      return;
    }

    if (!isYoutube && !isDirect) {
      toast({
        title: "URL inválida",
        description: "Usá un enlace de YouTube o un archivo directo (.mp4, .webm, .mov, .ogg).",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    try {
      let miniatura_url = episode?.miniatura_url ?? null;
      if (thumbFile) miniatura_url = await uploadImage(thumbFile, "programa");

      const payload = {
        titulo,
        descripcion: descripcion || null,
        video_url: normalizedVideoUrl,
        miniatura_url,
        temporada,
        episodio,
        duracion: duracion || "00:00",
        activo,
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

      <input placeholder="URL del video (YouTube o enlace directo)" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required={!videoFile}
        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />

      <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg px-4 py-3 hover:border-primary/50 transition-colors">
        <Upload size={16} className="text-primary" />
        <span>{uploadingVideo ? "Subiendo video..." : videoFile ? videoFile.name : "O subí un archivo de video (.mp4, .webm, .mov)"}</span>
        <input type="file" accept="video/*" className="hidden" disabled={uploadingVideo}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVideoFileChange(f); }} />
        {uploadingVideo && <Loader2 size={14} className="animate-spin ml-auto" />}
      </label>

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

      {/* Thumbnail section */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
          <Image size={12} /> Miniatura personalizada
        </label>
        <div className="flex items-center gap-3">
          {/* Current thumbnail preview */}
          {(thumbFile || currentThumb) && (
            <div className="w-24 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0 border border-border">
              {thumbFile ? (
                <img src={URL.createObjectURL(thumbFile)} alt="Preview" className="w-full h-full object-cover" />
              ) : currentThumb ? (
                <img src={currentThumb} alt="Miniatura actual" className="w-full h-full object-cover" />
              ) : null}
            </div>
          )}
          {/* If direct video and no thumb, show video frame */}
          {!thumbFile && !currentThumb && videoUrl && isDirectVideo(videoUrl) && (
            <div className="w-24 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0 border border-border">
              <VideoThumbnail src={videoUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg px-3 py-2 hover:border-primary/50 transition-colors flex-1">
            <Upload size={14} />
            <span className="truncate">{thumbFile ? thumbFile.name : episode?.miniatura_url ? "Cambiar miniatura" : "Elegir imagen de miniatura"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)} />
          </label>
          {(thumbFile || episode?.miniatura_url) && (
            <button type="button" onClick={() => setThumbFile(null)}
              className="text-xs text-muted-foreground hover:text-foreground p-1">
              <X size={14} />
            </button>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Si no elegís miniatura, se usará automáticamente el primer frame del video o la miniatura de YouTube.
        </p>
      </div>

      <label className="flex items-center gap-2 cursor-pointer text-sm">
        <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} className="accent-primary" />
        <span className="text-muted-foreground">Activo</span>
      </label>

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
            const direct = isDirectVideo(ep.video_url);
            return (
              <div key={ep.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-3">
                {/* Thumbnail */}
                <div className="w-28 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0 relative">
                  {thumb ? (
                    <img src={thumb} alt={ep.titulo} className="w-full h-full object-cover" />
                  ) : direct ? (
                    <VideoThumbnail src={ep.video_url} alt={ep.titulo} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Play size={18} className="text-muted-foreground" /></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium text-sm truncate">{ep.titulo}</p>
                  <p className="text-muted-foreground text-xs">
                    T{ep.temporada} · E{ep.episodio} {ep.duracion && ep.duracion !== "00:00" ? `· ${ep.duracion}` : ""}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ep.activo ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                      {ep.activo ? "Activo" : "Inactivo"}
                    </span>
                    {/* View counts */}
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full" title="Vistas completas / a la mitad">
                      <Eye size={10} />
                      {(ep as any).vistas_completas ?? 0} completas · {(ep as any).vistas_mitad ?? 0} a la mitad
                    </span>
                  </div>
                </div>

                {/* Actions */}
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

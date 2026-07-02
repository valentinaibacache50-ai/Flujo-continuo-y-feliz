import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage, uploadProgramVideo } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Trash2, Upload, Loader2, Image, AlertCircle, Pencil, X,
  Camera, ChevronLeft, Star, Images, Video, Play, Link,
} from "lucide-react";
import VideoThumbnail from "@/components/VideoThumbnail";

type AlbumTipo = "fotos" | "videos";

// ─── Helpers YouTube ──────────────────────────────────────────────────────────

import { getYoutubeId, getYoutubeThumbnail, resolveVideoSource, isDirectVideoFile } from "@/lib/video-utils";

// ─── Album Form ───────────────────────────────────────────────────────────────

const AlbumForm = ({
  editingAlbum, tipo, onSave, onCancel,
}: {
  editingAlbum?: any; tipo: AlbumTipo; onSave: (album: any) => void; onCancel: () => void;
}) => {
  const { toast } = useToast();
  const [titulo, setTitulo] = useState(editingAlbum?.titulo ?? "");
  const [jornada, setJornada] = useState(editingAlbum?.jornada ?? "");
  const [descripcion, setDescripcion] = useState(editingAlbum?.descripcion ?? "");
  const [fecha, setFecha] = useState(
    editingAlbum?.fecha_publicacion
      ? new Date(editingAlbum.fecha_publicacion).toISOString().slice(0, 10)
      : ""
  );
  const [miniaturaFile, setMiniaturaFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let miniatura_url = editingAlbum?.miniatura_url ?? null;
      if (miniaturaFile) {
        miniatura_url = await uploadImage(miniaturaFile, "galeria");
      }

      const payload: any = { titulo, tipo };
      payload.jornada = jornada.trim() || null;
      payload.descripcion = descripcion.trim() || null;
      payload.fecha_publicacion = fecha ? new Date(fecha).toISOString() : null;
      if (miniatura_url) payload.miniatura_url = miniatura_url;

      if (editingAlbum) {
        const { data, error } = await supabase
          .from("albumes").update(payload).eq("id", editingAlbum.id).select().single();
        if (error) throw error;
        toast({ title: "Álbum actualizado" });
        onSave(data);
      } else {
        const { data, error } = await supabase
          .from("albumes").insert(payload).select().single();
        if (error) throw error;
        toast({ title: "Álbum creado" });
        onSave(data);
      }
    } catch (err: any) {
      toast({ title: `Error: ${err?.message ?? "no se pudo guardar"}`, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3 relative">
      <button type="button" onClick={onCancel} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
        <X size={18} />
      </button>
      <h3 className="text-sm font-semibold text-foreground">
        {editingAlbum ? "Editar álbum" : `Nuevo álbum de ${tipo}`}
      </h3>

      <input
        placeholder="Título del álbum *" value={titulo}
        onChange={(e) => setTitulo(e.target.value)} required
        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Jornada (ej: Jornada 5)" value={jornada}
          onChange={(e) => setJornada(e.target.value)}
          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <input
          type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <textarea
        placeholder="Descripción (opcional)" value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)} rows={2}
        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
      />

      {tipo === "fotos" && (
        <>
          <label className="flex items-center gap-2 px-4 py-3 bg-secondary border border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
            <Upload size={15} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {miniaturaFile ? miniaturaFile.name : editingAlbum?.miniatura_url ? "Reemplazar portada (opcional)" : "Imagen de portada"}
            </span>
            <input type="file" accept="image/*" onChange={(e) => setMiniaturaFile(e.target.files?.[0] || null)} className="hidden" />
          </label>

          {editingAlbum?.miniatura_url && !miniaturaFile && (
            <img src={editingAlbum.miniatura_url} alt="Portada actual" className="h-20 w-auto rounded-lg object-cover" />
          )}
        </>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {editingAlbum ? "Actualizar" : `Crear →`}
        </button>
        <button type="button" onClick={onCancel} className="text-sm text-muted-foreground hover:text-foreground">
          Cancelar
        </button>
      </div>
    </form>
  );
};

// ─── Albums List View ─────────────────────────────────────────────────────────

const AlbumsView = ({
  tipo, onOpenAlbum,
}: {
  tipo: AlbumTipo; onOpenAlbum: (album: any) => void;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<any | null>(null);

  const queryKey = ["albumes", tipo];

  const { data: albumes = [], isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const [{ data: albumData, error: albumErr }, { data: countData }] = await Promise.all([
        supabase.from("albumes").select("*").eq("tipo", tipo).order("fecha_publicacion", { ascending: false }),
        supabase.from("galeria").select("album_id").not("album_id", "is", null),
      ]);
      if (albumErr) throw albumErr;
      const countMap: Record<string, number> = {};
      for (const row of countData ?? []) {
        if (row.album_id) countMap[row.album_id] = (countMap[row.album_id] ?? 0) + 1;
      }
      return (albumData ?? []).map((a) => ({ ...a, itemCount: countMap[a.id] ?? 0 }));
    },
  });

  const deleteAlbum = async (id: string) => {
    await supabase.from("galeria").delete().eq("album_id", id);
    const { error } = await supabase.from("albumes").delete().eq("id", id);
    if (error) { toast({ title: "Error al eliminar", variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey });
    toast({ title: "Álbum eliminado" });
  };

  const handleSaved = (album: any) => {
    queryClient.invalidateQueries({ queryKey });
    setShowForm(false);
    if (!editingAlbum && album) onOpenAlbum(album);
    setEditingAlbum(null);
  };

  const IconTipo = tipo === "videos" ? Video : Camera;
  const labelTipo = tipo === "videos" ? "videos" : "fotos";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <IconTipo size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground capitalize">{albumes.length} álbum{albumes.length !== 1 ? "es" : ""}</span>
        </div>
        <button
          onClick={() => { setEditingAlbum(null); setShowForm(true); }}
          className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90"
        >
          <Plus size={16} /> Nuevo álbum
        </button>
      </div>

      {(showForm || editingAlbum) && (
        <AlbumForm
          tipo={tipo}
          editingAlbum={editingAlbum ?? undefined}
          onSave={handleSaved}
          onCancel={() => { setShowForm(false); setEditingAlbum(null); }}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : isError ? (
        <div className="text-center py-8 space-y-2">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-sm text-muted-foreground">Error: {(error as any)?.message ?? "error desconocido"}</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg">Reintentar</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albumes.map((album: any) => (
            <div
              key={album.id}
              className="bg-card border border-border rounded-xl overflow-hidden group relative cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => onOpenAlbum(album)}
            >
              <div className="aspect-[4/3] relative bg-secondary">
                {album.miniatura_url ? (
                  <img src={album.miniatura_url} alt={album.titulo} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <IconTipo size={28} className="text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-3 py-1.5 rounded-full flex items-center gap-1">
                    {tipo === "videos" ? <><Play size={12} /> Ver videos</> : <><Images size={12} /> Ver fotos</>}
                  </span>
                </div>
                {album.itemCount > 0 && (
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    {tipo === "videos" ? <Video size={9} /> : <Images size={9} />} {album.itemCount}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-foreground text-sm font-semibold truncate">{album.titulo}</p>
                {album.jornada && <p className="text-xs text-primary truncate">{album.jornada}</p>}
                {album.descripcion && <p className="text-xs text-muted-foreground truncate mt-0.5">{album.descripcion}</p>}
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingAlbum(album); setShowForm(false); }}
                  className="p-1.5 bg-background/70 rounded-lg text-muted-foreground hover:text-primary"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteAlbum(album.id); }}
                  className="p-1.5 bg-background/70 rounded-lg text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          {albumes.length === 0 && !showForm && (
            <div className="col-span-full text-center text-muted-foreground py-12">
              <IconTipo size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay álbumes de {labelTipo} todavía.</p>
              <button onClick={() => setShowForm(true)} className="mt-3 text-primary text-sm hover:underline">
                Crear el primero
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Album Fotos View ─────────────────────────────────────────────────────────

const AlbumFotosView = ({ album, onBack }: { album: any; onBack: () => void }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState(album);

  const { data: fotos = [], isLoading } = useQuery({
    queryKey: ["album_fotos", currentAlbum.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("galeria").select("*").eq("album_id", currentAlbum.id).order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const uploadFotos = async (files: FileList) => {
    if (files.length === 0) return;
    setUploading(true);
    setUploadProgress({ done: 0, total: files.length });
    let ok = 0; let failed = 0;
    for (const file of Array.from(files)) {
      try {
        const imagen_url = await uploadImage(file, "galeria");
        const { error } = await supabase.from("galeria").insert({
          titulo: file.name.replace(/\.[^.]+$/, ""),
          tipo: "Foto",
          imagen_url,
          album_id: currentAlbum.id,
        });
        if (error) throw error;
        ok++;
      } catch { failed++; }
      setUploadProgress((prev) => prev ? { ...prev, done: prev.done + 1 } : null);
    }
    queryClient.invalidateQueries({ queryKey: ["album_fotos", currentAlbum.id] });
    queryClient.invalidateQueries({ queryKey: ["albumes", "fotos"] });
    setUploading(false);
    setUploadProgress(null);
    if (ok > 0) toast({ title: `${ok} foto${ok !== 1 ? "s" : ""} subida${ok !== 1 ? "s" : ""}` });
    if (failed > 0) toast({ title: `${failed} no se pudo${failed !== 1 ? "n" : ""} subir`, variant: "destructive" });
  };

  const deleteFoto = async (id: string) => {
    const { error } = await supabase.from("galeria").delete().eq("id", id);
    if (error) { toast({ title: "Error al eliminar", variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["album_fotos", currentAlbum.id] });
    queryClient.invalidateQueries({ queryKey: ["albumes", "fotos"] });
    toast({ title: "Foto eliminada" });
  };

  const setMiniatura = async (foto: any) => {
    const { error } = await supabase.from("albumes").update({ miniatura_url: foto.imagen_url }).eq("id", currentAlbum.id);
    if (error) { toast({ title: "Error", variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["albumes", "fotos"] });
    setCurrentAlbum({ ...currentAlbum, miniatura_url: foto.imagen_url });
    toast({ title: "Portada actualizada" });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground truncate">{currentAlbum.titulo}</h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
            {currentAlbum.jornada && <span className="text-primary font-medium">{currentAlbum.jornada}</span>}
            <span>{fotos.length} foto{fotos.length !== 1 ? "s" : ""}</span>
            {currentAlbum.miniatura_url && <span className="flex items-center gap-1 text-primary"><Star size={10} /> Portada configurada</span>}
          </div>
        </div>
        <label className={`flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg cursor-pointer hover:bg-primary/90 shrink-0 ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? `Subiendo ${uploadProgress?.done}/${uploadProgress?.total}...` : "Subir fotos"}
          <input type="file" accept="image/*" multiple onChange={(e) => e.target.files && uploadFotos(e.target.files)} className="hidden" disabled={uploading} />
        </label>
      </div>

      {uploading && uploadProgress && (
        <div className="mb-4 mt-2">
          <div className="w-full bg-secondary rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${(uploadProgress.done / uploadProgress.total) * 100}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{uploadProgress.done} de {uploadProgress.total} fotos subidas</p>
        </div>
      )}

      {!isLoading && fotos.length === 0 && !uploading && (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl py-16 cursor-pointer hover:border-primary transition-colors mb-4">
          <Upload size={32} className="text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">Subí las fotos del álbum</p>
          <p className="text-xs text-muted-foreground mt-1">Podés seleccionar varias a la vez</p>
          <input type="file" accept="image/*" multiple onChange={(e) => e.target.files && uploadFotos(e.target.files)} className="hidden" />
        </label>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {fotos.map((foto: any) => {
            const isThumb = currentAlbum.miniatura_url === foto.imagen_url;
            return (
              <div key={foto.id} className="aspect-square rounded-xl overflow-hidden relative group bg-secondary border border-border">
                {foto.imagen_url ? (
                  <img src={foto.imagen_url} alt={foto.titulo || ""} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Image size={24} className="text-muted-foreground" /></div>
                )}
                {isThumb && (
                  <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-semibold">
                    <Star size={9} /> Portada
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!isThumb && foto.imagen_url && (
                    <button onClick={() => setMiniatura(foto)} title="Usar como portada" className="p-2 bg-primary/80 rounded-lg text-white hover:bg-primary">
                      <Star size={14} />
                    </button>
                  )}
                  <button onClick={() => deleteFoto(foto.id)} className="p-2 bg-destructive/80 rounded-lg text-white hover:bg-destructive">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Album Videos View ────────────────────────────────────────────────────────

const AlbumVideosView = ({ album, onBack }: { album: any; onBack: () => void }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitulo, setVideoTitulo] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(album);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["album_videos", currentAlbum.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("galeria").select("*").eq("album_id", currentAlbum.id).order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const addVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim() && !videoFile) return;
    setAdding(true);
    try {
      let finalVideoUrl = videoUrl.trim() || null;
      let imagenUrl: string | null = null;

      if (videoFile) {
        setUploading(true);
        const uploaded = await uploadProgramVideo(videoFile);
        imagenUrl = uploaded;
        if (!finalVideoUrl) finalVideoUrl = uploaded;
        setUploading(false);
      }

      const { error } = await supabase.from("galeria").insert({
        titulo: videoTitulo.trim() || videoFile?.name.replace(/\.[^.]+$/, "") || "Video",
        tipo: "Video",
        video_url: finalVideoUrl,
        imagen_url: imagenUrl,
        album_id: currentAlbum.id,
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["album_videos", currentAlbum.id] });
      queryClient.invalidateQueries({ queryKey: ["albumes", "videos"] });
      setVideoUrl("");
      setVideoTitulo("");
      setVideoFile(null);
      setShowAddForm(false);
      toast({ title: "Video agregado" });
    } catch (err: any) {
      toast({ title: `Error: ${err?.message}`, variant: "destructive" });
    } finally {
      setAdding(false);
      setUploading(false);
    }
  };

  const deleteVideo = async (id: string) => {
    const { error } = await supabase.from("galeria").delete().eq("id", id);
    if (error) { toast({ title: "Error al eliminar", variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["album_videos", currentAlbum.id] });
    queryClient.invalidateQueries({ queryKey: ["albumes", "videos"] });
    toast({ title: "Video eliminado" });
  };


  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground truncate">{currentAlbum.titulo}</h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            {currentAlbum.jornada && <span className="text-primary font-medium">{currentAlbum.jornada}</span>}
            <span>{videos.length} video{videos.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 shrink-0"
        >
          <Plus size={14} /> Agregar video
        </button>
      </div>

      {/* Formulario agregar video */}
      {showAddForm && (
        <form onSubmit={addVideo} className="bg-card border border-border rounded-xl p-4 mb-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">Agregar video</p>
          <input
            placeholder="Título del video (opcional)"
            value={videoTitulo} onChange={(e) => setVideoTitulo(e.target.value)}
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
          />
          <input
            placeholder="URL de YouTube (ej: https://youtube.com/watch?v=...)"
            value={videoUrl} onChange={(e) => { setVideoUrl(e.target.value); if (e.target.value) setVideoFile(null); }}
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" />
            <span>o subí un archivo</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <label className="flex items-center gap-2 px-4 py-3 bg-secondary border border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
            <Upload size={15} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate">
              {videoFile ? videoFile.name : "Subir video (.mp4, .webm, .mov)"}
            </span>
            <input type="file" accept="video/*" onChange={(e) => { setVideoFile(e.target.files?.[0] || null); if (e.target.files?.[0]) setVideoUrl(""); }} className="hidden" />
          </label>
          {/* Preview miniatura YouTube */}
          {videoUrl && getYoutubeThumbnail(videoUrl) && (
            <img src={getYoutubeThumbnail(videoUrl)!} alt="preview" className="h-20 rounded-lg object-cover" />
          )}
          {/* Preview video file */}
          {videoFile && (
            <video src={URL.createObjectURL(videoFile)} controls className="h-20 rounded-lg" />
          )}
          <div className="flex gap-3">
            <button type="submit" disabled={adding || (!videoUrl.trim() && !videoFile)}
              className="px-5 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
            >
              {(adding || uploading) && <Loader2 size={13} className="animate-spin" />}
              {uploading ? "Subiendo..." : "Agregar"}
            </button>
            <button type="button" onClick={() => { setShowAddForm(false); setVideoFile(null); }} className="text-sm text-muted-foreground hover:text-foreground">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {!isLoading && videos.length === 0 && !showAddForm && (
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl py-16 cursor-pointer hover:border-primary transition-colors mb-4"
          onClick={() => setShowAddForm(true)}
        >
          <Upload size={32} className="text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">Subir videos o agregar desde YouTube</p>
          <p className="text-xs text-muted-foreground mt-1">Click para agregar el primero</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video: any) => {
            const videoSrc = resolveVideoSource(video);
            const thumb = getYoutubeThumbnail(videoSrc);
            const isDirect = isDirectVideoFile(videoSrc);
            return (
              <div key={video.id} className="rounded-xl overflow-hidden relative group bg-secondary border border-border">
                <div className="aspect-video relative">
                  {thumb ? (
                    <img src={thumb} alt={video.titulo || ""} className="w-full h-full object-cover" loading="lazy" />
                  ) : isDirect && videoSrc ? (
                    <VideoThumbnail src={videoSrc} alt={video.titulo || ""} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Video size={28} className="text-muted-foreground" /></div>
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play size={22} className="text-white/60" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={() => deleteVideo(video.id)} className="p-2 bg-destructive/80 rounded-lg text-white hover:bg-destructive">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <p className="text-foreground text-xs font-medium truncate">{video.titulo || "Sin título"}</p>
                  <p className="text-[10px] text-muted-foreground">{isDirect ? "Archivo" : "YouTube"}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Main Panel ───────────────────────────────────────────────────────────────

const GaleriaPanel = () => {
  const [activeTab, setActiveTab] = useState<AlbumTipo>("fotos");
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);

  const handleOpenAlbum = (album: any) => setSelectedAlbum(album);
  const handleBack = () => setSelectedAlbum(null);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground">Galería</h2>
      </div>

      {/* Tabs */}
      {!selectedAlbum && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("fotos")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "fotos"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Camera size={15} /> Fotos
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "videos"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Video size={15} /> Videos
          </button>
        </div>
      )}

      {selectedAlbum ? (
        activeTab === "fotos" ? (
          <AlbumFotosView album={selectedAlbum} onBack={handleBack} />
        ) : (
          <AlbumVideosView album={selectedAlbum} onBack={handleBack} />
        )
      ) : (
        <AlbumsView tipo={activeTab} onOpenAlbum={handleOpenAlbum} />
      )}
    </div>
  );
};

export default GaleriaPanel;

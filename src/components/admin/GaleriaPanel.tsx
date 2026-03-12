import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Trash2, Upload, Loader2, Image, AlertCircle, Pencil, X, Camera, ChevronLeft, Star, Images,
} from "lucide-react";

// ─── Album Form ───────────────────────────────────────────────────────────────

const AlbumForm = ({
  editingAlbum,
  onSave,
  onCancel,
}: {
  editingAlbum?: any;
  onSave: (album: any) => void;
  onCancel: () => void;
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

      const payload: any = { titulo };
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
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3 relative"
    >
      <button type="button" onClick={onCancel} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
        <X size={18} />
      </button>
      <h3 className="text-sm font-semibold text-foreground">
        {editingAlbum ? "Editar álbum" : "Nuevo álbum"}
      </h3>

      <input
        placeholder="Título del álbum *"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Jornada (ej: Jornada 5)"
          value={jornada}
          onChange={(e) => setJornada(e.target.value)}
          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <textarea
        placeholder="Descripción del álbum (opcional)"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows={2}
        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
      />

      <label className="flex items-center gap-2 px-4 py-3 bg-secondary border border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
        <Upload size={15} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {miniaturaFile
            ? miniaturaFile.name
            : editingAlbum?.miniatura_url
            ? "Reemplazar portada (opcional)"
            : "Imagen de portada"}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setMiniaturaFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </label>

      {editingAlbum?.miniatura_url && !miniaturaFile && (
        <img src={editingAlbum.miniatura_url} alt="Portada actual" className="h-20 w-auto rounded-lg object-cover" />
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {editingAlbum ? "Actualizar" : "Crear y agregar fotos →"}
        </button>
        <button type="button" onClick={onCancel} className="text-sm text-muted-foreground hover:text-foreground">
          Cancelar
        </button>
      </div>
    </form>
  );
};

// ─── Albums List View ─────────────────────────────────────────────────────────

const AlbumsView = ({ onOpenAlbum }: { onOpenAlbum: (album: any) => void }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<any | null>(null);

  const { data: albumes = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["albumes"],
    queryFn: async () => {
      const [{ data: albumData, error: albumErr }, { data: countData }] = await Promise.all([
        supabase.from("albumes").select("*").order("fecha_publicacion", { ascending: false }),
        supabase.from("galeria").select("album_id").not("album_id", "is", null),
      ]);
      if (albumErr) throw albumErr;
      const countMap: Record<string, number> = {};
      for (const row of countData ?? []) {
        if (row.album_id) countMap[row.album_id] = (countMap[row.album_id] ?? 0) + 1;
      }
      return (albumData ?? []).map((a) => ({ ...a, fotoCount: countMap[a.id] ?? 0 }));
    },
  });

  const deleteAlbum = async (id: string) => {
    await supabase.from("galeria").delete().eq("album_id", id);
    const { error } = await supabase.from("albumes").delete().eq("id", id);
    if (error) { toast({ title: "Error al eliminar", variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["albumes"] });
    toast({ title: "Álbum eliminado" });
  };

  const handleSaved = (album: any) => {
    queryClient.invalidateQueries({ queryKey: ["albumes"] });
    setShowForm(false);
    // Si es nuevo álbum, navegar directo a agregar fotos
    if (!editingAlbum && album) {
      onOpenAlbum(album);
    }
    setEditingAlbum(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground">Galería — Álbumes</h2>
        <button
          onClick={() => { setEditingAlbum(null); setShowForm(true); }}
          className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90"
        >
          <Plus size={16} /> Nuevo álbum
        </button>
      </div>

      {(showForm || editingAlbum) && (
        <AlbumForm
          editingAlbum={editingAlbum ?? undefined}
          onSave={handleSaved}
          onCancel={() => { setShowForm(false); setEditingAlbum(null); }}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-center py-8 space-y-2">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-sm text-muted-foreground">
            Error al cargar álbumes: {(error as any)?.message ?? "error desconocido"}
          </p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg">
            Reintentar
          </button>
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
                    <Camera size={28} className="text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Images size={12} /> Ver fotos
                  </span>
                </div>
                {album.fotoCount > 0 && (
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Images size={9} /> {album.fotoCount}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-foreground text-sm font-semibold truncate">{album.titulo}</p>
                {album.jornada && <p className="text-xs text-primary truncate">{album.jornada}</p>}
                {album.descripcion && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{album.descripcion}</p>
                )}
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
              <Camera size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay álbumes todavía.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 text-primary text-sm hover:underline"
              >
                Crear el primero
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Album Photos View ────────────────────────────────────────────────────────

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
        .from("galeria")
        .select("*")
        .eq("album_id", currentAlbum.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const uploadFotos = async (files: FileList) => {
    if (files.length === 0) return;
    setUploading(true);
    setUploadProgress({ done: 0, total: files.length });
    let ok = 0;
    let failed = 0;
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
      } catch {
        failed++;
      }
      setUploadProgress((prev) => prev ? { ...prev, done: prev.done + 1 } : null);
    }
    queryClient.invalidateQueries({ queryKey: ["album_fotos", currentAlbum.id] });
    queryClient.invalidateQueries({ queryKey: ["albumes"] });
    setUploading(false);
    setUploadProgress(null);
    if (ok > 0) toast({ title: `${ok} foto${ok !== 1 ? "s" : ""} subida${ok !== 1 ? "s" : ""}` });
    if (failed > 0) toast({ title: `${failed} foto${failed !== 1 ? "s" : ""} no se pudo${failed !== 1 ? "n" : ""} subir`, variant: "destructive" });
  };

  const deleteFoto = async (id: string) => {
    const { error } = await supabase.from("galeria").delete().eq("id", id);
    if (error) { toast({ title: "Error al eliminar", variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["album_fotos", currentAlbum.id] });
    queryClient.invalidateQueries({ queryKey: ["albumes"] });
    toast({ title: "Foto eliminada" });
  };

  const setMiniatura = async (foto: any) => {
    const { error } = await supabase
      .from("albumes").update({ miniatura_url: foto.imagen_url }).eq("id", currentAlbum.id);
    if (error) { toast({ title: "Error", variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["albumes"] });
    setCurrentAlbum({ ...currentAlbum, miniatura_url: foto.imagen_url });
    toast({ title: "Portada actualizada" });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-space font-bold uppercase text-xl text-foreground truncate">{currentAlbum.titulo}</h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
            {currentAlbum.jornada && <span className="text-primary font-medium">{currentAlbum.jornada}</span>}
            <span>{fotos.length} foto{fotos.length !== 1 ? "s" : ""}</span>
            {currentAlbum.miniatura_url && (
              <span className="flex items-center gap-1 text-primary"><Star size={10} /> Portada configurada</span>
            )}
          </div>
          {currentAlbum.descripcion && (
            <p className="text-xs text-muted-foreground mt-1">{currentAlbum.descripcion}</p>
          )}
        </div>
        <label className={`flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg cursor-pointer hover:bg-primary/90 shrink-0 ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? `Subiendo ${uploadProgress?.done}/${uploadProgress?.total}...` : "Subir fotos"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && uploadFotos(e.target.files)}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Barra de progreso */}
      {uploading && uploadProgress && (
        <div className="mb-4 mt-2">
          <div className="w-full bg-secondary rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ width: `${(uploadProgress.done / uploadProgress.total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{uploadProgress.done} de {uploadProgress.total} fotos subidas</p>
        </div>
      )}

      {/* Zona de drop / primer upload */}
      {!isLoading && fotos.length === 0 && !uploading && (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl py-16 cursor-pointer hover:border-primary transition-colors mb-4">
          <Upload size={32} className="text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">Subí las fotos del álbum</p>
          <p className="text-xs text-muted-foreground mt-1">Podés seleccionar varias a la vez</p>
          <input type="file" accept="image/*" multiple onChange={(e) => e.target.files && uploadFotos(e.target.files)} className="hidden" />
        </label>
      )}

      {/* Grid de fotos */}
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
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={24} className="text-muted-foreground" />
                  </div>
                )}
                {isThumb && (
                  <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-semibold">
                    <Star size={9} /> Portada
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!isThumb && foto.imagen_url && (
                    <button
                      onClick={() => setMiniatura(foto)}
                      title="Usar como portada del álbum"
                      className="p-2 bg-primary/80 rounded-lg text-white hover:bg-primary"
                    >
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

// ─── Main Panel ───────────────────────────────────────────────────────────────

const GaleriaPanel = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);

  if (selectedAlbum) {
    return <AlbumFotosView album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
  }

  return <AlbumsView onOpenAlbum={setSelectedAlbum} />;
};

export default GaleriaPanel;

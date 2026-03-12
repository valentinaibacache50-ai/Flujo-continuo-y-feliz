import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Trash2, Upload, Loader2, Image, AlertCircle, Pencil, X, Camera, ChevronLeft, Star,
} from "lucide-react";

// ─── Album Form ───────────────────────────────────────────────────────────────

const AlbumForm = ({
  editingAlbum,
  onSave,
  onCancel,
}: {
  editingAlbum?: any;
  onSave: () => void;
  onCancel: () => void;
}) => {
  const { toast } = useToast();
  const [titulo, setTitulo] = useState(editingAlbum?.titulo ?? "");
  const [jornada, setJornada] = useState(editingAlbum?.jornada ?? "");
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
      if (jornada.trim()) payload.jornada = jornada.trim();
      else payload.jornada = null;
      if (fecha) payload.fecha_publicacion = new Date(fecha).toISOString();
      else payload.fecha_publicacion = null;
      if (miniatura_url) payload.miniatura_url = miniatura_url;

      if (editingAlbum) {
        const { error } = await supabase.from("albumes").update(payload).eq("id", editingAlbum.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("albumes").insert(payload);
        if (error) throw error;
      }

      toast({ title: editingAlbum ? "Álbum actualizado" : "Álbum creado" });
      onSave();
    } catch {
      toast({ title: "Error al guardar álbum", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3 relative"
    >
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
      >
        <X size={18} />
      </button>
      <h3 className="text-sm font-semibold text-foreground">
        {editingAlbum ? "Editar álbum" : "Nuevo álbum"}
      </h3>

      <input
        placeholder="Título del álbum"
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
        <img
          src={editingAlbum.miniatura_url}
          alt="Portada actual"
          className="h-20 w-auto rounded-lg object-cover"
        />
      )}

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
      >
        {saving && <Loader2 size={14} className="animate-spin" />}
        {editingAlbum ? "Actualizar" : "Crear álbum"}
      </button>
    </form>
  );
};

// ─── Albums List View ─────────────────────────────────────────────────────────

const AlbumsView = ({
  onOpenAlbum,
}: {
  onOpenAlbum: (album: any) => void;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<any | null>(null);

  const { data: albumes = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["albumes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("albumes")
        .select("*")
        .order("fecha_publicacion", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const deleteAlbum = async (id: string) => {
    const { error } = await supabase.from("albumes").delete().eq("id", id);
    if (error) {
      toast({ title: "Error al eliminar", variant: "destructive" });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["albumes"] });
    toast({ title: "Álbum eliminado" });
  };

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ["albumes"] });
    setShowForm(false);
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
        <div className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg">
            Reintentar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albumes.map((album: any) => (
            <div key={album.id} className="bg-card border border-border rounded-xl overflow-hidden group relative">
              <div
                className="aspect-[4/3] relative bg-secondary cursor-pointer"
                onClick={() => onOpenAlbum(album)}
              >
                {album.miniatura_url ? (
                  <img src={album.miniatura_url} alt={album.titulo} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera size={28} className="text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-3 py-1.5 rounded-full">
                    Ver fotos
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-foreground text-sm font-semibold truncate">{album.titulo}</p>
                {album.jornada && <p className="text-xs text-primary truncate">{album.jornada}</p>}
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
          {albumes.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-8">
              No hay álbumes. Crea el primero.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Album Photos View ────────────────────────────────────────────────────────

const AlbumFotosView = ({
  album,
  onBack,
}: {
  album: any;
  onBack: () => void;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
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
    let ok = 0;
    try {
      for (const file of Array.from(files)) {
        const imagen_url = await uploadImage(file, "galeria");
        const { error } = await supabase.from("galeria").insert({
          titulo: file.name.replace(/\.[^.]+$/, ""),
          tipo: "Foto",
          imagen_url,
          album_id: currentAlbum.id,
        });
        if (!error) ok++;
      }
      queryClient.invalidateQueries({ queryKey: ["album_fotos", currentAlbum.id] });
      toast({ title: `${ok} foto${ok !== 1 ? "s" : ""} subida${ok !== 1 ? "s" : ""}` });
    } catch {
      toast({ title: "Error al subir fotos", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const deleteFoto = async (id: string) => {
    const { error } = await supabase.from("galeria").delete().eq("id", id);
    if (error) { toast({ title: "Error al eliminar", variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["album_fotos", currentAlbum.id] });
    toast({ title: "Foto eliminada" });
  };

  const setMiniatura = async (foto: any) => {
    const { error } = await supabase
      .from("albumes")
      .update({ miniatura_url: foto.imagen_url })
      .eq("id", currentAlbum.id);
    if (error) { toast({ title: "Error", variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["albumes"] });
    setCurrentAlbum({ ...currentAlbum, miniatura_url: foto.imagen_url });
    toast({ title: "Miniatura actualizada" });
  };

  const MAX_FOTOS = 20;

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-space font-bold uppercase text-xl text-foreground truncate">
            {currentAlbum.titulo}
          </h2>
          {currentAlbum.jornada && (
            <p className="text-xs text-primary">{currentAlbum.jornada}</p>
          )}
        </div>
        <label
          className={`flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg cursor-pointer hover:bg-primary/90 shrink-0 ${
            uploading || fotos.length >= MAX_FOTOS ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Subiendo..." : "Subir fotos"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && uploadFotos(e.target.files)}
            className="hidden"
            disabled={uploading || fotos.length >= MAX_FOTOS}
          />
        </label>
      </div>

      <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          {fotos.length} / {MAX_FOTOS} fotos
        </span>
        {currentAlbum.miniatura_url ? (
          <span className="flex items-center gap-1 text-primary text-xs">
            <Star size={11} /> Miniatura configurada
          </span>
        ) : (
          <span className="text-xs">— Hover sobre una foto para fijar miniatura</span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {fotos.map((foto: any) => {
            const isThumb = currentAlbum.miniatura_url === foto.imagen_url;
            return (
              <div
                key={foto.id}
                className="aspect-square rounded-xl overflow-hidden relative group bg-secondary border border-border"
              >
                {foto.imagen_url ? (
                  <img
                    src={foto.imagen_url}
                    alt={foto.titulo || ""}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={24} className="text-muted-foreground" />
                  </div>
                )}

                {isThumb && (
                  <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-semibold">
                    <Star size={9} /> Miniatura
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!isThumb && foto.imagen_url && (
                    <button
                      onClick={() => setMiniatura(foto)}
                      title="Usar como miniatura del álbum"
                      className="p-2 bg-primary/80 rounded-lg text-white hover:bg-primary"
                    >
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteFoto(foto.id)}
                    className="p-2 bg-destructive/80 rounded-lg text-white hover:bg-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          {fotos.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-8">
              No hay fotos. Subí las primeras.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Panel ───────────────────────────────────────────────────────────────

const GaleriaPanel = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);

  if (selectedAlbum) {
    return (
      <AlbumFotosView
        album={selectedAlbum}
        onBack={() => setSelectedAlbum(null)}
      />
    );
  }

  return <AlbumsView onOpenAlbum={setSelectedAlbum} />;
};

export default GaleriaPanel;

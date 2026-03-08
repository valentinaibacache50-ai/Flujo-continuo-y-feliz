import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

const initialNoticias = [
  { id: 1, title: "La final Sub-12 que nadie olvidará", tag: "Crónica", date: "Hoy" },
  { id: 2, title: "Los números de la jornada 8", tag: "Estadísticas", date: "Ayer" },
  { id: 3, title: "Samuel, 11 años y ya lidera", tag: "Nota especial", date: "Hace 3 días" },
];

const NoticiasPanel = () => {
  const [noticias, setNoticias] = useState(initialNoticias);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const { toast } = useToast();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = { id: Date.now(), title, tag, date: "Ahora" };
    setNoticias([newItem, ...noticias]);
    setTitle("");
    setTag("");
    setShowForm(false);
    toast({ title: "Noticia agregada" });
  };

  const handleDelete = (id: number) => {
    setNoticias(noticias.filter((n) => n.id !== id));
    toast({ title: "Noticia eliminada" });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground">Gestión de Noticias</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90"
        >
          <Plus size={16} /> Nueva
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3">
          <input
            placeholder="Título de la noticia"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            required
          />
          <input
            placeholder="Etiqueta (Crónica, Estadísticas, etc.)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            required
          />
          <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
            Guardar
          </button>
        </form>
      )}

      <div className="space-y-3">
        {noticias.map((n) => (
          <div key={n.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-foreground font-medium">{n.title}</h3>
              <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">{n.tag}</span>
                <span>{n.date}</span>
              </div>
            </div>
            <button onClick={() => handleDelete(n.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticiasPanel;

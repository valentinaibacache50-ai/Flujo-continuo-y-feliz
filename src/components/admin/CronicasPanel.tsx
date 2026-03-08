import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

const initialCronicas = [
  { id: 1, title: "La final que hizo llorar hasta al árbitro", tag: "Crónica Sub-12", date: "Hoy" },
  { id: 2, title: "¿Por qué el Sub-17 es el equipo más completo?", tag: "Análisis Sub-17", date: "Hace 5 días" },
];

const CronicasPanel = () => {
  const [cronicas, setCronicas] = useState(initialCronicas);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setCronicas([{ id: Date.now(), title, tag, date: "Ahora" }, ...cronicas]);
    setTitle(""); setTag(""); setContent("");
    setShowForm(false);
    toast({ title: "Crónica publicada" });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground">Gestión de Crónicas</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
          <Plus size={16} /> Nueva
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3">
          <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          <input placeholder="Etiqueta" value={tag} onChange={(e) => setTag(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          <textarea placeholder="Contenido de la crónica..." rows={5} value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" required />
          <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">Publicar</button>
        </form>
      )}

      <div className="space-y-3">
        {cronicas.map((c) => (
          <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-foreground font-medium">{c.title}</h3>
              <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">{c.tag}</span>
                <span>{c.date}</span>
              </div>
            </div>
            <button onClick={() => { setCronicas(cronicas.filter((x) => x.id !== c.id)); toast({ title: "Eliminada" }); }} className="text-muted-foreground hover:text-destructive">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CronicasPanel;

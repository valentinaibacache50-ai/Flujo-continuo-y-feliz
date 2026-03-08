import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

const initialItems = [
  { id: 1, title: "Gol decisivo Sub-12", type: "Foto" },
  { id: 2, title: "Highlight Jornada 8", type: "Video" },
  { id: 3, title: "Entrenamiento táctico Sub-15", type: "Foto" },
];

const GaleriaPanel = () => {
  const [items, setItems] = useState(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Foto");
  const { toast } = useToast();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setItems([{ id: Date.now(), title, type }, ...items]);
    setTitle("");
    setShowForm(false);
    toast({ title: "Elemento agregado a galería" });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground">Gestión de Galería</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
          <Plus size={16} /> Subir
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3">
          <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary">
            <option value="Foto">Foto</option>
            <option value="Video">Video</option>
          </select>
          <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">Guardar</button>
        </form>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-foreground font-medium">{item.title}</h3>
              <span className="text-xs text-primary">{item.type}</span>
            </div>
            <button onClick={() => { setItems(items.filter((i) => i.id !== item.id)); toast({ title: "Eliminado" }); }} className="text-muted-foreground hover:text-destructive">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GaleriaPanel;

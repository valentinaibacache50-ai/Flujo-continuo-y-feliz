import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

const initialProducts = [
  { id: 1, title: "Fotos Partido — Final Sub-12", type: "Foto", price: "$8.000" },
  { id: 2, title: "Highlight Jornada 8", type: "Video", price: "$12.000" },
  { id: 3, title: "Pack Familia — Fotos + Video", type: "Pack", price: "$18.000" },
];

const ProductosPanel = () => {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Foto");
  const [price, setPrice] = useState("");
  const { toast } = useToast();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts([{ id: Date.now(), title, type, price }, ...products]);
    setTitle(""); setPrice("");
    setShowForm(false);
    toast({ title: "Producto agregado" });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground">Gestión de Productos</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3">
          <input placeholder="Nombre del producto" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary">
            <option value="Foto">Foto</option>
            <option value="Video">Video</option>
            <option value="Pack">Pack</option>
          </select>
          <input placeholder="Precio (ej: $8.000)" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">Guardar</button>
        </form>
      )}

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-foreground font-medium">{p.title}</h3>
              <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">{p.type}</span>
                <span className="text-primary font-semibold">{p.price}</span>
              </div>
            </div>
            <button onClick={() => { setProducts(products.filter((x) => x.id !== p.id)); toast({ title: "Eliminado" }); }} className="text-muted-foreground hover:text-destructive">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosPanel;

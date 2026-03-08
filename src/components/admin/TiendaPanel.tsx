import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, Star } from "lucide-react";

const TiendaPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [precioAnual, setPrecioAnual] = useState("");
  const [periodo, setPeriodo] = useState("por evento");
  const [descripcion, setDescripcion] = useState("");
  const [features, setFeatures] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [esPopular, setEsPopular] = useState(false);

  const { data: productos = [], isLoading } = useQuery({
    queryKey: ["productos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("productos").select("*").order("orden", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const featuresArray = features.split(",").map(f => f.trim()).filter(Boolean);
      const { error } = await supabase.from("productos").insert({
        nombre, precio, precio_anual: precioAnual || null, periodo, descripcion: descripcion || null,
        features: featuresArray, whatsapp_url: whatsappUrl || null, es_popular: esPopular,
        orden: productos.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setNombre(""); setPrecio(""); setPrecioAnual(""); setDescripcion(""); setFeatures(""); setWhatsappUrl(""); setEsPopular(false);
      setShowForm(false);
      toast({ title: "Producto agregado" });
    },
    onError: () => toast({ title: "Error al agregar", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("productos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast({ title: "Producto eliminado" });
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase text-2xl text-foreground">Gestión de Tienda</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
          <Plus size={16} /> Nuevo producto
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate(); }} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Nombre (ej: FOTOS)" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
            <input placeholder="Precio (ej: 8000)" value={precio} onChange={(e) => setPrecio(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Precio anual (opcional)" value={precioAnual} onChange={(e) => setPrecioAnual(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            <input placeholder="Período (ej: por evento)" value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          </div>
          <input placeholder="Descripción corta" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          <textarea placeholder="Características (separadas por coma: Alta resolución, Descarga digital, ...)" value={features} onChange={(e) => setFeatures(e.target.value)} rows={3} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" />
          <input placeholder="URL de WhatsApp" value={whatsappUrl} onChange={(e) => setWhatsappUrl(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={esPopular} onChange={(e) => setEsPopular(e.target.checked)} className="rounded" />
            Marcar como popular
          </label>
          <button type="submit" disabled={addMutation.isPending} className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
            {addMutation.isPending && <Loader2 size={14} className="animate-spin" />}
            Guardar
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {productos.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground font-medium">{p.nombre}</h3>
                  {p.es_popular && <Star size={14} className="text-primary fill-primary" />}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">${p.precio}</span>
                  <span>{p.periodo}</span>
                  <span>{p.features?.length || 0} características</span>
                </div>
              </div>
              <button onClick={() => deleteMutation.mutate(p.id)} className="text-muted-foreground hover:text-destructive flex-shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {productos.length === 0 && <p className="text-center text-muted-foreground py-8">No hay productos aún</p>}
        </div>
      )}
    </div>
  );
};

export default TiendaPanel;

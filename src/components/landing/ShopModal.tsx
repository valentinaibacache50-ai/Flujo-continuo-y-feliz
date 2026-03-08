import { X } from "lucide-react";

interface Product {
  type: string;
  title: string;
  details: string;
  price: string;
}

interface ShopModalProps {
  product: Product | null;
  onClose: () => void;
}

const ShopModal = ({ product, onClose }: ShopModalProps) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>

        <span className="text-xs font-semibold text-primary tracking-widest">{product.type}</span>
        <h3 className="font-space font-bold text-2xl text-foreground mt-2 mb-2">{product.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{product.details}</p>
        <p className="text-3xl font-bold text-primary mb-6">{product.price}</p>

        <a
          href="https://wa.me/573000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Comprar por WhatsApp
        </a>
      </div>
    </div>
  );
};

export default ShopModal;

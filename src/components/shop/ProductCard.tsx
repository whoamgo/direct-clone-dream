import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ProductCard = ({ product }: { product: Product }) => {
  const { add, toggleWish, wishlist } = useCart();
  const wished = wishlist.includes(product.id);
  const off = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  return (
    <div className="product-card group flex flex-col h-full">
      <div className="relative">
        <Link to={`/product/${product.slug}`} className="block">
          <div className="aspect-square flex items-center justify-center text-7xl sm:text-8xl" style={{ background: product.bg }}>
            <span className="drop-shadow-sm transition-transform group-hover:scale-110 duration-300">{product.emoji}</span>
          </div>
        </Link>
        {off > 0 && (
          <span className="absolute top-2 left-2 bg-sale text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded">
            {off}% OFF
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-2 right-2 bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded">NEW</span>
        )}
        <button
          onClick={() => { toggleWish(product.id); toast.success(wished ? "Removed from wishlist" : "Added to wishlist"); }}
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-card/90 backdrop-blur shadow flex items-center justify-center hover:bg-card transition"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${wished ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        <Link to={`/product/${product.slug}`} className="text-sm font-medium line-clamp-2 hover:text-primary transition min-h-[2.5rem]">
          {product.name}
        </Link>
        <div className="flex items-center gap-1 text-xs">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? "fill-rating text-rating" : "text-muted"}`} />
          ))}
          <span className="text-muted-foreground ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-base font-bold text-price">₹{product.price.toFixed(2)}</span>
          {product.mrp > product.price && <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>}
        </div>
        <Button
          size="sm"
          className="mt-2 h-8 text-xs"
          onClick={() => { add(product); toast.success(`${product.name} added to cart`); }}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Minus, Plus, ImageIcon } from "lucide-react";
import { Product } from "@/features/shop/data/products";
import { useCart } from "@/features/cart/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ProductCard = ({ product }: { product: Product }) => {
  const { add, remove, setQty, items, toggleWish, wishlist } = useCart();
  const wished = wishlist.includes(product.id);
  const off = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  // Lightweight image-load skeleton: the visual is an emoji on a tinted bg,
  // so we simulate the swap from skeleton -> content on first mount.
  const [imgLoaded, setImgLoaded] = useState(false);
  // Simulate the image load: a short delay shows the skeleton on first paint
  // and avoids the harsh emoji pop on slow connections.
  useEffect(() => {
    const t = setTimeout(() => setImgLoaded(true), 250);
    return () => clearTimeout(t);
  }, []);
  // Track the cart line for this product so the card can render a qty stepper
  // once the item has been added.
  const cartLine = items.find((i) => i.product.id === product.id);
  return (
    <div className="product-card group flex flex-col h-full">
      <div className="relative">
        <Link to={`/product/${product.slug}`} className="block">
          <div className="relative aspect-square flex items-center justify-center text-7xl sm:text-8xl overflow-hidden" style={{ background: product.bg }}>
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-muted/60 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
              </div>
            )}
            <span className={`drop-shadow-sm transition-all duration-300 ${imgLoaded ? "opacity-100 group-hover:scale-110" : "opacity-0"}`}>{product.emoji}</span>
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
        {cartLine ? (
          // After "Add to Cart" the button morphs into a qty stepper bound to the cart line.
          <div className="mt-2 h-8 flex items-center justify-between border border-primary rounded text-primary">
            <button
              aria-label="Decrease quantity"
              className="px-2 h-full hover:bg-primary/10"
              onClick={() => cartLine.qty <= 1 ? remove(product.id) : setQty(product.id, cartLine.qty - 1)}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold">{cartLine.qty} in cart</span>
            <button
              aria-label="Increase quantity"
              className="px-2 h-full hover:bg-primary/10"
              onClick={() => setQty(product.id, cartLine.qty + 1)}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Button
            size="sm"
            className="mt-2 h-8 text-xs"
            onClick={() => { add(product); toast.success(`${product.name} added to cart`); }}
          >
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
};

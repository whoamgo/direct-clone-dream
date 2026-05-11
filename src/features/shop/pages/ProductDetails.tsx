import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, Star, ShieldCheck, Truck, RotateCcw, Minus, Plus, Eye, RefreshCcw, Home, ChevronRight, ImageIcon } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bySlug, byCategory } from "@/features/shop/data/products";
import { useCart } from "@/features/cart/context/CartContext";
import { ProductRow } from "@/features/shop/components/ProductRow";
import { toast } from "sonner";

const ProductDetails = () => {
  const { slug } = useParams();
  const product = slug ? bySlug(slug) : undefined;
  const { add, toggleWish, wishlist } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  // Per-image load state so switching thumbnails shows a brief skeleton.
  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => {
    setImgLoaded(false);
    const t = setTimeout(() => setImgLoaded(true), 350);
    return () => clearTimeout(t);
  }, [activeImg, slug]);
  const nav = useNavigate();

  if (!product) {
    return <Layout><div className="container-page py-20 text-center"><h1 className="text-2xl font-bold">Product not found</h1><Link to="/shop" className="text-primary mt-4 inline-block">Back to shop</Link></div></Layout>;
  }
  const off = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const wished = wishlist.includes(product.id);
  // mock multi-image gallery using same emoji on tinted backgrounds
  const tints = [product.bg, "#F5F5F7", "#FFF4E0", "#E8F8E8"];
  const images = tints.map((bg, i) => ({ bg, label: i }));
  const buyNow = () => { add(product, qty); nav("/checkout"); };

  return (
    <Layout hasStickyCta>
      <div className="container-page py-6">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-4 flex-wrap">
          <Link to="/" className="hover:text-primary"><Home className="w-3.5 h-3.5" /></Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/category/${product.category}`} className="hover:text-primary capitalize">{product.category.replace(/-/g, " ")}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </nav>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden border border-border" style={{ background: images[activeImg].bg }}>
              <div className="aspect-square flex items-center justify-center text-[10rem] sm:text-[12rem]">
                {!imgLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-muted/60 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
                  </div>
                )}
                <span className={`transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}>{product.emoji}</span>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              {images.map((im, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md border-2 overflow-hidden flex items-center justify-center text-3xl shrink-0 ${activeImg === i ? "border-primary" : "border-border hover:border-foreground/30"}`}
                  style={{ background: im.bg }}
                  aria-label={`View image ${i + 1}`}
                >
                  {product.emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold">{product.name}</h1>
            <div className="flex items-center gap-2 text-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-rating text-rating" : "text-muted"}`} />
              ))}
              <span className="text-muted-foreground">{product.reviews} reviews</span>
            </div>
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-extrabold text-price">₹{product.price.toFixed(2)}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.mrp}</span>
                  <span className="bg-sale text-primary-foreground text-xs font-bold px-2 py-1 rounded">{off}% OFF</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Ex Tax: ₹{product.price.toFixed(2)}</p>

            <table className="text-sm w-full max-w-md">
              <tbody className="[&_td]:py-1 [&_td:first-child]:text-muted-foreground [&_td:first-child]:pr-4 [&_td:first-child]:w-32">
                <tr><td>Brand:</td><td className="font-medium">{product.brand}</td></tr>
                <tr><td>Product Code:</td><td className="font-medium">{product.id.toUpperCase()}</td></tr>
                <tr><td>Availability:</td><td className="font-medium text-accent">✓ In Stock</td></tr>
                <tr><td>Viewed:</td><td className="font-medium flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {100 + product.reviews * 4} times</td></tr>
              </tbody>
            </table>

            <div className="pt-2">
              <p className="text-sm font-semibold mb-2">Qty</p>
              <div className="flex items-center border border-border rounded-md w-fit">
                <button className="p-2 hover:bg-muted" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="w-4 h-4" /></button>
                <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value || 1))} className="w-12 text-center bg-transparent outline-none font-semibold" />
                <button className="p-2 hover:bg-muted" onClick={() => setQty((q) => q + 1)}><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button size="lg" variant="outline" className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/20" onClick={() => { add(product, qty); toast.success(`${qty} × ${product.name} added`); }}>
                Add to Cart
              </Button>
              <Button size="lg" onClick={buyNow}>Buy Now</Button>
            </div>

            <div className="flex items-center gap-5 pt-3 text-sm">
              <button onClick={() => { toggleWish(product.id); toast.success(wished ? "Removed" : "Wishlisted"); }} className="flex items-center gap-2 hover:text-primary">
                <span className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                  <Heart className={`w-4 h-4 text-primary ${wished ? "fill-primary" : ""}`} />
                </span>
                <span className="font-semibold uppercase tracking-wide text-xs">Add to Wishlist</span>
              </button>
              <button className="flex items-center gap-2 hover:text-primary">
                <span className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                  <RefreshCcw className="w-4 h-4 text-primary" />
                </span>
                <span className="font-semibold uppercase tracking-wide text-xs">Add to Compare</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4">
              {[[Truck,"Free Delivery"], [ShieldCheck,"100% Genuine"], [RotateCcw,"Easy Returns"]].map(([I, t], i) => {
                const Ic = I as typeof Truck;
                return (
                  <div key={i} className="text-center p-3 rounded-lg bg-muted">
                    <Ic className="w-5 h-5 mx-auto text-primary mb-1" />
                    <p className="text-xs font-medium">{t as string}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Tabs defaultValue="desc" className="mt-10">
          <TabsList>
            <TabsTrigger value="desc">Description</TabsTrigger>
            <TabsTrigger value="info">Additional Info</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
          </TabsList>
          <TabsContent value="desc" className="prose prose-sm max-w-none text-foreground/90 mt-4">
            <p>{product.desc}</p>
            <p>Always consult a qualified physician before starting any new supplement, especially if you are pregnant, nursing, or taking other medications.</p>
          </TabsContent>
          <TabsContent value="info" className="mt-4 text-sm">
            <table className="w-full max-w-md">
              <tbody>
                <tr className="border-b border-border"><td className="py-2 text-muted-foreground">Brand</td><td className="py-2 font-medium">{product.brand}</td></tr>
                <tr className="border-b border-border"><td className="py-2 text-muted-foreground">Category</td><td className="py-2 font-medium capitalize">{product.category.replace(/-/g, " ")}</td></tr>
                <tr className="border-b border-border"><td className="py-2 text-muted-foreground">Country of Origin</td><td className="py-2 font-medium">India</td></tr>
                <tr><td className="py-2 text-muted-foreground">SKU</td><td className="py-2 font-medium">{product.id.toUpperCase()}</td></tr>
              </tbody>
            </table>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4 text-sm text-muted-foreground">No public reviews yet. Be the first to review this product.</TabsContent>
        </Tabs>
      </div>
      <ProductRow title="Related Products" products={byCategory(product.category).filter((p) => p.id !== product.id).slice(0, 10)} />

      {/* Spacer so the mobile sticky CTA bar doesn't cover the last row */}
      <div className="h-14 lg:hidden" aria-hidden="true" />

      {/* Mobile sticky Add-to-Cart / Buy Now bar */}
      <div className="lg:hidden fixed bottom-14 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-center gap-2 shadow-[0_-4px_16px_-8px_hsl(220_15%_15%/0.15)]">
        <div className="flex-shrink-0">
          <p className="text-[10px] text-muted-foreground leading-none">Total</p>
          <p className="text-base font-extrabold text-price leading-tight">₹{(product.price * qty).toFixed(2)}</p>
        </div>
        <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10" onClick={() => { add(product, qty); toast.success(`${qty} × ${product.name} added`); }}>
          Add to Cart
        </Button>
        <Button className="flex-1" onClick={buyNow}>Buy Now</Button>
      </div>
    </Layout>
  );
};
export default ProductDetails;

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Star, ShieldCheck, Truck, RotateCcw, Minus, Plus } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bySlug, byCategory } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ProductRow } from "@/components/shop/ProductRow";
import { toast } from "sonner";

const ProductDetails = () => {
  const { slug } = useParams();
  const product = slug ? bySlug(slug) : undefined;
  const { add, toggleWish, wishlist } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return <Layout><div className="container-page py-20 text-center"><h1 className="text-2xl font-bold">Product not found</h1><Link to="/shop" className="text-primary mt-4 inline-block">Back to shop</Link></div></Layout>;
  }
  const off = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const wished = wishlist.includes(product.id);

  return (
    <Layout>
      <div className="container-page py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link> / <Link to={`/category/${product.category}`} className="hover:text-primary">{product.category}</Link> / <span className="text-foreground">{product.name}</span>
        </nav>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-xl overflow-hidden border border-border" style={{ background: product.bg }}>
            <div className="aspect-square flex items-center justify-center text-[12rem]">{product.emoji}</div>
          </div>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{product.brand}</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{product.name}</h1>
            <div className="flex items-center gap-2 text-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-rating text-rating" : "text-muted"}`} />
              ))}
              <span className="text-muted-foreground">{product.rating.toFixed(1)} • {product.reviews} reviews</span>
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
            <p className="text-sm text-accent font-semibold">In Stock • Inclusive of all taxes</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.desc}</p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-border rounded-md">
                <button className="p-2 hover:bg-muted" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="w-4 h-4" /></button>
                <span className="px-4 font-semibold">{qty}</span>
                <button className="p-2 hover:bg-muted" onClick={() => setQty((q) => q + 1)}><Plus className="w-4 h-4" /></button>
              </div>
              <Button size="lg" className="flex-1" onClick={() => { add(product, qty); toast.success(`${qty} × ${product.name} added`); }}>Add to Cart</Button>
              <Button size="lg" variant="outline" onClick={() => { toggleWish(product.id); toast.success(wished ? "Removed" : "Wishlisted"); }}>
                <Heart className={`w-5 h-5 ${wished ? "fill-primary text-primary" : ""}`} />
              </Button>
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
    </Layout>
  );
};
export default ProductDetails;

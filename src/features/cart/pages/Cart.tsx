import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/context/CartContext";

const Cart = () => {
  const { items, setQty, remove, total, clear } = useCart();
  return (
    <Layout>
      <div className="container-page py-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-6">Your Cart</h1>
        {items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Button asChild><Link to="/shop">Continue Shopping</Link></Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            <div className="space-y-3">
              {items.map((i) => (
                <div key={i.product.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-card border border-border rounded-lg">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded flex items-center justify-center text-4xl shrink-0" style={{ background: i.product.bg }}>{i.product.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase text-muted-foreground">{i.product.brand}</p>
                    <Link to={`/product/${i.product.slug}`} className="font-medium text-sm sm:text-base line-clamp-2 hover:text-primary">{i.product.name}</Link>
                    <p className="text-price font-bold mt-1">₹{i.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => remove(i.product.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    <div className="flex items-center border border-border rounded">
                      <button className="p-1 hover:bg-muted" onClick={() => setQty(i.product.id, i.qty - 1)}><Minus className="w-3 h-3" /></button>
                      <span className="px-3 text-sm font-semibold">{i.qty}</span>
                      <button className="p-1 hover:bg-muted" onClick={() => setQty(i.product.id, i.qty + 1)}><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={clear} size="sm">Clear Cart</Button>
            </div>
            <aside className="bg-card border border-border rounded-lg p-5 h-fit space-y-3 lg:sticky lg:top-32">
              <h2 className="font-bold text-lg">Order Summary</h2>
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{total.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span>Shipping</span><span className="text-accent font-semibold">{total > 499 ? "FREE" : "₹49"}</span></div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-lg"><span>Total</span><span className="text-price">₹{(total + (total > 499 ? 0 : 49)).toFixed(2)}</span></div>
              <Button asChild className="w-full" size="lg"><Link to="/checkout">Proceed to Checkout</Link></Button>
              <Button asChild variant="outline" className="w-full"><Link to="/shop">Continue Shopping</Link></Button>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default Cart;

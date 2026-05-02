import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const Checkout = () => {
  const { items, total, clear } = useCart();
  const nav = useNavigate();
  const [pay, setPay] = useState("cod");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Order placed successfully (demo)");
    clear();
    nav("/");
  };
  if (items.length === 0) {
    return <Layout><div className="container-page py-20 text-center"><p>Your cart is empty.</p></div></Layout>;
  }
  return (
    <Layout>
      <div className="container-page py-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-6">Checkout</h1>
        <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-6">
            <section className="bg-card border border-border rounded-lg p-5 space-y-4">
              <h2 className="font-bold">Shipping Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Full Name</Label><Input required /></div>
                <div><Label>Phone</Label><Input required type="tel" /></div>
                <div className="sm:col-span-2"><Label>Address</Label><Input required /></div>
                <div><Label>City</Label><Input required /></div>
                <div><Label>State</Label><Input required /></div>
                <div><Label>Pincode</Label><Input required /></div>
                <div><Label>Email</Label><Input required type="email" /></div>
              </div>
            </section>
            <section className="bg-card border border-border rounded-lg p-5 space-y-3">
              <h2 className="font-bold">Payment Method</h2>
              <RadioGroup value={pay} onValueChange={setPay}>
                {[["cod","Cash on Delivery"],["upi","UPI"],["card","Credit / Debit Card"],["nb","Net Banking"]].map(([v,l]) => (
                  <label key={v} className="flex items-center gap-3 p-3 border border-border rounded cursor-pointer hover:bg-muted">
                    <RadioGroupItem value={v} /> <span className="text-sm">{l}</span>
                  </label>
                ))}
              </RadioGroup>
            </section>
          </div>
          <aside className="bg-card border border-border rounded-lg p-5 h-fit space-y-3 lg:sticky lg:top-32">
            <h2 className="font-bold">Order Summary</h2>
            {items.map((i) => (
              <div key={i.product.id} className="flex justify-between text-sm">
                <span className="line-clamp-1 mr-2">{i.qty}× {i.product.name}</span>
                <span>₹{(i.qty * i.product.price).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between font-bold"><span>Total</span><span className="text-price">₹{(total + (total > 499 ? 0 : 49)).toFixed(2)}</span></div>
            <Button type="submit" className="w-full" size="lg">Place Order</Button>
          </aside>
        </form>
      </div>
    </Layout>
  );
};
export default Checkout;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Package, Truck, Home as HomeIcon, MapPin, CreditCard, Printer } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

type OrderItem = { id: string; name: string; brand: string; qty: number; price: number; emoji: string; bg: string };
type Order = {
  id: string; placedAt: string;
  address: { fullName: string; phone: string; email: string; line1: string; line2: string; city: string; state: string; pincode: string; type: string };
  payment: string;
  items: OrderItem[];
  subtotal: number; shipping: number; tax: number; total: number;
};

const payLabels: Record<string, string> = { cod: "Cash on Delivery", upi: "UPI", card: "Credit / Debit Card", nb: "Net Banking" };

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lastOrder");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  if (!order || (id && order.id !== id)) {
    return (
      <Layout>
        <div className="container-page py-20 text-center space-y-3">
          <h1 className="text-2xl font-bold">Order details unavailable</h1>
          <p className="text-muted-foreground">We couldn't find this order in your session.</p>
          <Button asChild><Link to="/shop">Continue Shopping</Link></Button>
        </div>
      </Layout>
    );
  }

  const eta = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });

  return (
    <Layout>
      <div className="container-page py-8 sm:py-10 max-w-4xl">
        {/* Success header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Thank you for your order!</h1>
          <p className="text-muted-foreground mt-2">Your order <span className="font-bold text-foreground">#{order.id}</span> has been placed successfully.</p>
          <p className="text-sm text-muted-foreground">A confirmation has been sent to {order.address.email}.</p>
        </div>

        {/* Tracking timeline */}
        <div className="bg-card border border-border rounded-lg p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {[
              { i: CheckCircle2, l: "Order Placed", done: true },
              { i: Package, l: "Packed", done: false },
              { i: Truck, l: "Shipped", done: false },
              { i: HomeIcon, l: "Delivered", done: false },
            ].map((s, idx, arr) => {
              const Icon = s.i;
              return (
                <div key={s.l} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${s.done ? "bg-accent border-accent text-accent-foreground" : "bg-muted border-border text-muted-foreground"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-semibold ${s.done ? "text-foreground" : "text-muted-foreground"}`}>{s.l}</span>
                  </div>
                  {idx < arr.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-5 ${s.done ? "bg-accent" : "bg-border"}`} />}
                </div>
              );
            })}
          </div>
          <p className="text-center text-sm mt-5">
            Estimated delivery: <span className="font-bold text-accent">{eta}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3"><MapPin className="w-4 h-4 text-primary" /><h2 className="font-bold text-sm">Shipping Address</h2></div>
            <p className="text-sm font-semibold">{order.address.fullName}</p>
            <p className="text-sm text-muted-foreground mt-1">{order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}</p>
            <p className="text-sm text-muted-foreground">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
            <p className="text-sm text-muted-foreground mt-1">📞 {order.address.phone}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3"><CreditCard className="w-4 h-4 text-primary" /><h2 className="font-bold text-sm">Payment Method</h2></div>
            <p className="text-sm font-semibold">{payLabels[order.payment] ?? order.payment}</p>
            <p className="text-xs text-muted-foreground mt-1">Order placed on {new Date(order.placedAt).toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-card border border-border rounded-lg p-5 sm:p-6 mb-6">
          <h2 className="font-bold mb-4">Items in this order</h2>
          <div className="divide-y divide-border">
            {order.items.map((i) => (
              <div key={i.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <div className="w-14 h-14 rounded flex items-center justify-center text-2xl shrink-0" style={{ background: i.bg }}>{i.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase text-muted-foreground">{i.brand}</p>
                  <p className="text-sm font-medium line-clamp-2">{i.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {i.qty}</p>
                </div>
                <p className="text-sm font-bold text-price whitespace-nowrap">₹{(i.qty * i.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 space-y-1.5 text-sm max-w-xs ml-auto">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>₹{order.tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-border"><span>Total Paid</span><span className="text-price">₹{order.total.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild size="lg"><Link to="/shop">Continue Shopping</Link></Button>
          <Button asChild variant="outline" size="lg"><Link to="/account?tab=orders">View My Orders</Link></Button>
          <Button variant="outline" size="lg" onClick={() => window.print()}><Printer className="w-4 h-4 mr-1.5" /> Print Receipt</Button>
        </div>
      </div>
    </Layout>
  );
};
export default OrderConfirmation;
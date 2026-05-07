import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ChevronRight, MapPin, CreditCard, ClipboardCheck, Check, Truck, Banknote, Smartphone, Building2, Pencil } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/features/cart/context/CartContext";
import { toast } from "sonner";

type Address = {
  fullName: string; phone: string; email: string;
  line1: string; line2: string; city: string; state: string; pincode: string;
  type: "home" | "work" | "other";
};

const emptyAddress: Address = { fullName: "", phone: "", email: "", line1: "", line2: "", city: "", state: "", pincode: "", type: "home" };

const payMethods = [
  { v: "cod", l: "Cash on Delivery", d: "Pay when your order arrives", icon: Banknote },
  { v: "upi", l: "UPI", d: "Google Pay, PhonePe, Paytm, BHIM", icon: Smartphone },
  { v: "card", l: "Credit / Debit Card", d: "Visa, Mastercard, RuPay, Amex", icon: CreditCard },
  { v: "nb", l: "Net Banking", d: "All major Indian banks", icon: Building2 },
] as const;

const stepDefs = [
  { id: 1, label: "Address", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: ClipboardCheck },
] as const;

const Checkout = () => {
  const { items, total, clear } = useCart();
  const nav = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [pay, setPay] = useState<string>("cod");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upi, setUpi] = useState("");
  const [bank, setBank] = useState("HDFC Bank");
  const [placing, setPlacing] = useState(false);

  const shipping = total > 499 ? 0 : 49;
  const tax = +(total * 0.05).toFixed(2);
  const grand = +(total + shipping + tax).toFixed(2);

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-page py-20 text-center">
          <p className="text-muted-foreground mb-4">Your cart is empty.</p>
          <Button asChild><Link to="/shop">Continue Shopping</Link></Button>
        </div>
      </Layout>
    );
  }

  const submitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.pincode.length < 6) { toast.error("Enter a valid 6-digit pincode"); return; }
    if (address.phone.length < 10) { toast.error("Enter a valid phone number"); return; }
    setStep(2);
  };

  const submitPayment = () => {
    if (pay === "card") {
      if (card.number.replace(/\s/g, "").length < 12) { toast.error("Enter a valid card number"); return; }
      if (card.cvv.length < 3) { toast.error("Enter a valid CVV"); return; }
    }
    if (pay === "upi" && !/.+@.+/.test(upi)) { toast.error("Enter a valid UPI ID"); return; }
    setStep(3);
  };

  const placeOrder = () => {
    setPlacing(true);
    const orderId = "DD" + Math.floor(100000 + Math.random() * 900000);
    const order = {
      id: orderId,
      placedAt: new Date().toISOString(),
      address,
      payment: pay,
      items: items.map((i) => ({ id: i.product.id, name: i.product.name, brand: i.product.brand, qty: i.qty, price: i.product.price, emoji: i.product.emoji, bg: i.product.bg })),
      subtotal: total, shipping, tax, total: grand,
    };
    setTimeout(() => {
      try { sessionStorage.setItem("lastOrder", JSON.stringify(order)); } catch {}
      clear();
      toast.success("Order placed successfully");
      nav(`/order-confirmation/${orderId}`);
    }, 700);
  };

  return (
    <Layout>
      <div className="container-page py-6">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary"><Home className="w-3.5 h-3.5" /></Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/cart" className="hover:text-primary">Cart</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Checkout</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-extrabold mb-6">Secure Checkout</h1>

        {/* Stepper */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mb-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {stepDefs.map((s, idx) => {
              const Icon = s.icon;
              const active = step === s.id;
              const done = step > s.id;
              return (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${done ? "bg-accent border-accent text-accent-foreground" : active ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-border text-muted-foreground"}`}>
                      {done ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs font-semibold ${active || done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                  </div>
                  {idx < stepDefs.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-5 ${step > s.id ? "bg-accent" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-6">
            {/* Step 1: Address */}
            {step === 1 && (
              <form onSubmit={submitAddress} className="bg-card border border-border rounded-lg p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="font-bold text-lg">Shipping Address</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Full Name *</Label><Input required value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} /></div>
                  <div><Label>Phone *</Label><Input required type="tel" maxLength={10} value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, "") })} /></div>
                  <div className="sm:col-span-2"><Label>Email *</Label><Input required type="email" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} /></div>
                  <div className="sm:col-span-2"><Label>Address Line 1 *</Label><Input required placeholder="House no, Building, Street" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} /></div>
                  <div className="sm:col-span-2"><Label>Address Line 2</Label><Input placeholder="Landmark, Area (optional)" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} /></div>
                  <div><Label>City *</Label><Input required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} /></div>
                  <div><Label>State *</Label><Input required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} /></div>
                  <div><Label>Pincode *</Label><Input required maxLength={6} value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "") })} /></div>
                </div>
                <div>
                  <Label className="mb-2 block">Address Type</Label>
                  <RadioGroup value={address.type} onValueChange={(v) => setAddress({ ...address, type: v as Address["type"] })} className="flex gap-2 flex-wrap">
                    {(["home","work","other"] as const).map((t) => (
                      <label key={t} className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer text-sm capitalize ${address.type === t ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}>
                        <RadioGroupItem value={t} /> {t}
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="flex justify-between gap-3 pt-2">
                  <Button asChild type="button" variant="outline"><Link to="/cart">Back to Cart</Link></Button>
                  <Button type="submit" size="lg">Continue to Payment</Button>
                </div>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-card border border-border rounded-lg p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="font-bold text-lg">Payment Method</h2>
                </div>
                <RadioGroup value={pay} onValueChange={setPay} className="space-y-3">
                  {payMethods.map((m) => {
                    const Icon = m.icon;
                    const active = pay === m.v;
                    return (
                      <label key={m.v} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition ${active ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}>
                        <RadioGroupItem value={m.v} className="mt-1" />
                        <Icon className={`w-5 h-5 mt-0.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{m.l}</p>
                          <p className="text-xs text-muted-foreground">{m.d}</p>
                          {active && m.v === "card" && (
                            <div className="grid sm:grid-cols-2 gap-3 mt-4">
                              <div className="sm:col-span-2"><Label>Card Number</Label><Input value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="1234 5678 9012 3456" /></div>
                              <div className="sm:col-span-2"><Label>Name on Card</Label><Input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} /></div>
                              <div><Label>Expiry (MM/YY)</Label><Input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="12/28" /></div>
                              <div><Label>CVV</Label><Input type="password" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} /></div>
                            </div>
                          )}
                          {active && m.v === "upi" && (
                            <div className="mt-4"><Label>UPI ID</Label><Input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="yourname@okhdfcbank" /></div>
                          )}
                          {active && m.v === "nb" && (
                            <div className="mt-4">
                              <Label>Select Bank</Label>
                              <select value={bank} onChange={(e) => setBank(e.target.value)} className="mt-1 w-full h-10 px-3 border border-border rounded-md bg-background text-sm">
                                {["HDFC Bank","ICICI Bank","SBI","Axis Bank","Kotak Mahindra","Yes Bank","IDFC First"].map((b) => <option key={b}>{b}</option>)}
                              </select>
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </RadioGroup>
                <div className="flex justify-between gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" size="lg" onClick={submitPayment}>Review Order</Button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /><h2 className="font-bold">Deliver To</h2></div>
                    <button onClick={() => setStep(1)} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"><Pencil className="w-3 h-3" /> Edit</button>
                  </div>
                  <p className="text-sm font-semibold">{address.fullName} <span className="ml-2 text-xs uppercase bg-muted px-2 py-0.5 rounded">{address.type}</span></p>
                  <p className="text-sm text-muted-foreground mt-1">{address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} - {address.pincode}</p>
                  <p className="text-sm text-muted-foreground mt-1">📞 {address.phone} • ✉️ {address.email}</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /><h2 className="font-bold">Payment</h2></div>
                    <button onClick={() => setStep(2)} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"><Pencil className="w-3 h-3" /> Edit</button>
                  </div>
                  <p className="text-sm">{payMethods.find((m) => m.v === pay)?.l}
                    {pay === "card" && card.number && <span className="text-muted-foreground"> • **** {card.number.slice(-4)}</span>}
                    {pay === "upi" && upi && <span className="text-muted-foreground"> • {upi}</span>}
                    {pay === "nb" && <span className="text-muted-foreground"> • {bank}</span>}
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-5 sm:p-6">
                  <h2 className="font-bold mb-3">Items ({items.reduce((s, i) => s + i.qty, 0)})</h2>
                  <div className="divide-y divide-border">
                    {items.map((i) => (
                      <div key={i.product.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                        <div className="w-14 h-14 rounded flex items-center justify-center text-2xl shrink-0" style={{ background: i.product.bg }}>{i.product.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{i.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {i.qty}</p>
                        </div>
                        <p className="text-sm font-bold text-price whitespace-nowrap">₹{(i.qty * i.product.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 flex items-start gap-3">
                  <Truck className="w-5 h-5 text-accent mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold">Estimated delivery in 2-4 business days</p>
                    <p className="text-muted-foreground text-xs mt-0.5">Free shipping on orders above ₹499</p>
                  </div>
                </div>

                <div>
                  <Label>Order Notes (optional)</Label>
                  <Textarea placeholder="Any special instructions?" rows={3} />
                </div>

                <div className="flex justify-between gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button type="button" size="lg" onClick={placeOrder} disabled={placing}>
                    {placing ? "Placing Order..." : `Place Order • ₹${grand.toFixed(2)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky summary */}
          <aside className="bg-card border border-border rounded-lg p-5 h-fit space-y-3 lg:sticky lg:top-32">
            <h2 className="font-bold text-lg">Order Summary</h2>
            <div className="space-y-2 max-h-60 overflow-auto pr-1">
              {items.map((i) => (
                <div key={i.product.id} className="flex justify-between text-sm gap-2">
                  <span className="line-clamp-1">{i.qty}× {i.product.name}</span>
                  <span className="whitespace-nowrap">₹{(i.qty * i.product.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className={shipping === 0 ? "text-accent font-semibold" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax (5%)</span><span>₹{tax.toFixed(2)}</span></div>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
              <span>Total</span><span className="text-price">₹{grand.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center pt-2">🔒 100% secure payment</p>
          </aside>
        </div>
      </div>
    </Layout>
  );
};
export default Checkout;

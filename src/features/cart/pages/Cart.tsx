import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, Home, ChevronRight, Tag, Truck, Gift } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCart } from "@/features/cart/context/CartContext";
import { toast } from "sonner";

// Demo coupons — in production swap for an API call
const COUPONS: Record<string, { type: "flat" | "percent"; value: number; label: string }> = {
  WELCOME10: { type: "percent", value: 10, label: "10% off" },
  SAVE100: { type: "flat", value: 100, label: "₹100 off" },
  FREESHIP: { type: "flat", value: 49, label: "Free shipping" },
};

const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia", "UAE"];
const STATES_IN = ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Gujarat", "Telangana", "West Bengal", "Uttar Pradesh", "Rajasthan", "Kerala"];

const Cart = () => {
  const { items, setQty, remove, total, clear } = useCart();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; amount: number; label: string } | null>(null);
  const [country, setCountry] = useState("India");
  const [region, setRegion] = useState("Maharashtra");
  const [pincode, setPincode] = useState("");
  const [shipQuote, setShipQuote] = useState<number | null>(null);
  const [gift, setGift] = useState("");
  const [giftAmount, setGiftAmount] = useState(0);

  const baseShipping = total > 499 ? 0 : 49;
  const shipping = shipQuote ?? baseShipping;
  const discount = appliedCoupon?.amount ?? 0;
  const grand = Math.max(0, total + shipping - discount - giftAmount);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    const c = COUPONS[code];
    if (!c) { toast.error("Invalid coupon code"); return; }
    const amount = c.type === "percent" ? +(total * c.value / 100).toFixed(2) : c.value;
    setAppliedCoupon({ code, amount, label: c.label });
    toast.success(`Coupon applied — ${c.label}`);
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCoupon(""); };

  const getQuotes = () => {
    if (pincode.length < 4) { toast.error("Enter a valid post code"); return; }
    const quote = country === "India" ? (total > 499 ? 0 : 49) : 299;
    setShipQuote(quote);
    toast.success(quote === 0 ? "Free shipping available" : `Shipping estimate: ₹${quote}`);
  };

  const applyGift = () => {
    const code = gift.trim().toUpperCase();
    if (code === "GIFT500") { setGiftAmount(500); toast.success("Gift certificate applied: ₹500"); }
    else { toast.error("Invalid gift certificate"); }
  };

  return (
    <Layout>
      <div className="container-page py-6">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary"><Home className="w-3.5 h-3.5" /></Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Shopping Cart</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-6">Your Cart {items.length > 0 && <span className="text-muted-foreground font-medium text-base">({items.reduce((s, i) => s + i.qty, 0)} items)</span>}</h1>
        {items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Button asChild><Link to="/shop">Continue Shopping</Link></Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            <div className="space-y-4">
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

              {/* What would you like to do next? */}
              <div className="pt-4">
                <h2 className="text-xl font-bold mb-1">What would you like to do next?</h2>
                <p className="text-sm text-muted-foreground mb-4">Choose if you have a discount code or gift certificate you want to use or would like to estimate your delivery cost.</p>

                <Accordion type="multiple" className="space-y-3">
                  <AccordionItem value="coupon" className="border border-border rounded-lg bg-card overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline bg-muted/50 font-bold text-sm">
                      <span className="flex items-center gap-2"><Tag className="w-4 h-4" /> Use Coupon Code</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-3">
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between gap-3 bg-accent/10 border border-accent/30 p-3 rounded">
                          <div className="text-sm"><span className="font-bold">{appliedCoupon.code}</span> — {appliedCoupon.label} (−₹{appliedCoupon.amount.toFixed(2)})</div>
                          <Button size="sm" variant="outline" onClick={removeCoupon}>Remove</Button>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-[160px_1fr_auto] gap-3 items-center">
                          <Label className="font-semibold">Enter your coupon here</Label>
                          <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter your coupon here" />
                          <Button onClick={applyCoupon}>Apply Coupon</Button>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">Try: WELCOME10, SAVE100, FREESHIP</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="ship" className="border border-border rounded-lg bg-card overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline bg-muted/50 font-bold text-sm">
                      <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Estimate Shipping &amp; Taxes</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-3 space-y-3">
                      <p className="text-sm text-muted-foreground">Enter your destination to get a shipping estimate.</p>
                      <div className="grid sm:grid-cols-[140px_1fr] gap-3 items-center">
                        <Label className="font-semibold">Country</Label>
                        <select value={country} onChange={(e) => setCountry(e.target.value)} className="h-10 px-3 border border-border rounded-md bg-background text-sm">
                          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                        <Label className="font-semibold">Region / State</Label>
                        <select value={region} onChange={(e) => setRegion(e.target.value)} className="h-10 px-3 border border-border rounded-md bg-background text-sm">
                          {STATES_IN.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        <Label className="font-semibold">Post Code</Label>
                        <Input value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))} maxLength={6} placeholder="Post Code" />
                      </div>
                      <Button onClick={getQuotes}>Get Quotes</Button>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="gift" className="border border-border rounded-lg bg-card overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline bg-muted/50 font-bold text-sm">
                      <span className="flex items-center gap-2"><Gift className="w-4 h-4" /> Use Gift Certificate</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-3">
                      {giftAmount > 0 ? (
                        <div className="flex items-center justify-between gap-3 bg-accent/10 border border-accent/30 p-3 rounded">
                          <div className="text-sm"><span className="font-bold">Gift applied</span> — ₹{giftAmount} credit</div>
                          <Button size="sm" variant="outline" onClick={() => { setGiftAmount(0); setGift(""); }}>Remove</Button>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-[180px_1fr_auto] gap-3 items-center">
                          <Label className="font-semibold">Enter your gift certificate code here</Label>
                          <Input value={gift} onChange={(e) => setGift(e.target.value)} placeholder="Enter your gift certificate code here" />
                          <Button onClick={applyGift}>Apply Gift Certificate</Button>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">Try: GIFT500</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            <aside className="bg-card border border-border rounded-lg p-5 h-fit space-y-3 lg:sticky lg:top-32">
              <h2 className="font-bold text-lg">Order Summary</h2>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Sub-Total</span><span>₹{total.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className={shipping === 0 ? "text-accent font-semibold" : ""}>{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Coupon ({appliedCoupon?.code})</span><span className="text-accent font-semibold">−₹{discount.toFixed(2)}</span></div>
              )}
              {giftAmount > 0 && (
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Gift Credit</span><span className="text-accent font-semibold">−₹{giftAmount.toFixed(2)}</span></div>
              )}
              <div className="border-t border-border pt-3 flex justify-between font-bold text-lg"><span>Total</span><span className="text-price">₹{grand.toFixed(2)}</span></div>
              <Button asChild className="w-full" size="lg"><Link to="/checkout">Checkout</Link></Button>
              <Button asChild variant="outline" className="w-full"><Link to="/shop">Continue Shopping</Link></Button>
              <p className="text-xs text-muted-foreground text-center pt-1">🔒 Secure checkout</p>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default Cart;

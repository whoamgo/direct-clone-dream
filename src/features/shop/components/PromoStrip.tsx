import { Truck, ShieldCheck, Clock, BadgePercent } from "lucide-react";
const items = [
  { I: Truck, t: "Free Shipping", s: "On orders over ₹499" },
  { I: ShieldCheck, t: "100% Genuine", s: "Verified medicines" },
  { I: Clock, t: "Express Delivery", s: "Same-day in metros" },
  { I: BadgePercent, t: "Best Prices", s: "Up to 25% off MRP" },
];
export const PromoStrip = () => (
  <section className="container-page py-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map(({ I, t, s }) => (
        <div key={t} className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"><I className="w-5 h-5" /></div>
          <div><div className="font-semibold text-sm">{t}</div><div className="text-xs text-muted-foreground">{s}</div></div>
        </div>
      ))}
    </div>
  </section>
);

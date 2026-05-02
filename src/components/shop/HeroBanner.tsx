import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Daily Healthcare Items",
    sub: "To Keep You Fit",
    text: "A one stop shop for all your health problems",
    badge: "Up to 15% OFF",
    cta: "Order Now",
    href: "/shop",
    emoji: "💊",
    bg: "from-sky-100 to-blue-200 dark:from-slate-800 dark:to-slate-700",
  },
  {
    title: "Premium Vitamins",
    sub: "& Nutrition",
    text: "Boost your immunity with curated supplements",
    badge: "Flat 15% OFF",
    cta: "Shop Vitamins",
    href: "/category/vitamins-and-nutrition",
    emoji: "🍊",
    bg: "from-orange-100 to-amber-200 dark:from-slate-800 dark:to-amber-950",
  },
  {
    title: "Ayurveda Wellness",
    sub: "Naturally Powerful",
    text: "Time tested formulas for everyday vitality",
    badge: "Save 20%",
    cta: "Explore Ayurveda",
    href: "/category/ayurveda",
    emoji: "🌿",
    bg: "from-emerald-100 to-green-200 dark:from-slate-800 dark:to-emerald-950",
  },
];

export const HeroBanner = () => {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5000); return () => clearInterval(t); }, []);
  const s = slides[i];
  return (
    <div className="container-page pt-4">
      <div className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${s.bg} transition-all duration-700`}>
        <div className="grid sm:grid-cols-2 gap-4 items-center p-6 sm:p-10 min-h-[260px] sm:min-h-[340px]">
          <div className="space-y-3 animate-fade-in" key={i}>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight text-foreground">
              {s.title}<br /><span className="text-primary">{s.sub}</span>
            </h1>
            <p className="text-foreground/80 text-sm sm:text-base">{s.text}</p>
            <div className="text-2xl sm:text-3xl font-extrabold text-secondary">{s.badge}</div>
            <Button asChild size="lg" className="mt-2"><Link to={s.href}>{s.cta}</Link></Button>
          </div>
          <div className="hidden sm:flex items-center justify-center text-[10rem] lg:text-[12rem] leading-none">
            <span className="drop-shadow-2xl animate-fade-in" key={`e-${i}`}>{s.emoji}</span>
          </div>
        </div>
        <button onClick={() => setI((x) => (x - 1 + slides.length) % slides.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setI((x) => (x + 1) % slides.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card">
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-primary" : "w-1.5 bg-foreground/30"}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

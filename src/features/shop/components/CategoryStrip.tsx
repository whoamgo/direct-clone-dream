import { Link } from "react-router-dom";
import { useRef } from "react";
import {
  ChevronLeft, ChevronRight,
  Leaf, Pill, Apple, MilkOff, Dumbbell, HeartPulse,
  Stethoscope, SprayCan, Scissors, Brush, Hand, Baby,
  type LucideIcon,
} from "lucide-react";
import { categories } from "@/features/shop/data/products";

const iconMap: Record<string, LucideIcon> = {
  ayurveda: Leaf,
  homeopathy: Pill,
  "vitamins-and-nutrition": Apple,
  "nutritional-drinks": MilkOff,
  "fitness-supplements": Dumbbell,
  "sexual-wellness": HeartPulse,
  "stomach-pain-care": Stethoscope,
  "skin-care": SprayCan,
  "hair-care": Scissors,
  "oral-care": Brush,
  "sanitizers-handwash": Hand,
  "baby-care": Baby,
};

export const CategoryStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };
  return (
    <section className="container-page py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Shop by Category</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="w-9 h-9 rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground transition flex items-center justify-center" aria-label="Previous">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll(1)} className="w-9 h-9 rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground transition flex items-center justify-center" aria-label="Next">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-2 -mx-1 px-1">
        {categories.map((c) => {
          const Icon = iconMap[c.slug] ?? Pill;
          const color = (c as any).color ?? "hsl(var(--primary))";
          return (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className="snap-start shrink-0 w-[110px] sm:w-[130px] flex flex-col items-center gap-2 p-3 rounded-lg bg-card border border-border hover:border-primary hover:shadow-md transition group"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition ring-1 ring-border"
                style={{ backgroundColor: `${color}1A`, color }}
              >
                <Icon className="w-7 h-7" strokeWidth={2} />
              </div>
              <span className="text-[11px] text-center font-medium leading-tight">{c.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/features/shop/data/products";
import { ProductCard } from "./ProductCard";
import { Link } from "react-router-dom";

export const ProductRow = ({ title, products, viewAllHref }: { title: string; products: Product[]; viewAllHref?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: -1 | 1) => ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  return (
    <section className="container-page py-6 sm:py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">{title}</h2>
        {viewAllHref && (
          <Link to={viewAllHref} className="text-sm font-semibold text-primary hover:underline">See All</Link>
        )}
      </div>
      <div className="relative">
        <button onClick={() => scroll(-1)} className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border shadow items-center justify-center hover:bg-muted">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div ref={ref} className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-pl-4 pb-2">
          {products.map((p) => (
            <div key={p.id} className="snap-start shrink-0 w-[160px] sm:w-[200px] md:w-[220px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <button onClick={() => scroll(1)} className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border shadow items-center justify-center hover:bg-muted">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

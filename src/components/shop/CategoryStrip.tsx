import { Link } from "react-router-dom";
import { categories } from "@/data/products";

export const CategoryStrip = () => (
  <section className="container-page py-6">
    <h2 className="section-title mb-4">Shop by Category</h2>
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
      {categories.map((c) => (
        <Link key={c.slug} to={`/category/${c.slug}`} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-card border border-border hover:border-primary hover:shadow-md transition group">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl group-hover:scale-110 transition">{c.icon}</div>
          <span className="text-[11px] text-center font-medium leading-tight">{c.name}</span>
        </Link>
      ))}
    </div>
  </section>
);

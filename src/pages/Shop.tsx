import { useMemo, useState } from "react";
import { useSearchParams, useParams, Link } from "react-router-dom";
import { Home, ChevronRight, ChevronDown, LayoutGrid, List as ListIcon } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/shop/ProductCard";
import { products, categories } from "@/data/products";
import { Button } from "@/components/ui/button";

const Shop = () => {
  const [params] = useSearchParams();
  const { slug } = useParams();
  const q = params.get("q")?.toLowerCase() ?? "";
  const cat = slug;

  const baseList = useMemo(() => products.filter((p) =>
    (!cat || p.category === cat) &&
    (!q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
  ), [q, cat]);

  const allBrands = useMemo(() => Array.from(new Set(baseList.map((p) => p.brand))), [baseList]);
  const priceMin = baseList.length ? Math.min(...baseList.map((p) => p.price)) : 0;
  const priceMax = baseList.length ? Math.max(...baseList.map((p) => p.price)) : 0;

  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [minP, setMinP] = useState<number>(Math.floor(priceMin));
  const [maxP, setMaxP] = useState<number>(Math.ceil(priceMax));
  const [grid, setGrid] = useState<2 | 3 | 4>(4);
  const [sort, setSort] = useState("default");
  const [perPage, setPerPage] = useState(15);

  const list = useMemo(() => {
    let arr = baseList.filter((p) => (brandFilter.length === 0 || brandFilter.includes(p.brand)) && p.price >= minP && p.price <= maxP);
    if (sort === "price-asc") arr = [...arr].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") arr = [...arr].sort((a, b) => b.price - a.price);
    if (sort === "name-asc") arr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "rating") arr = [...arr].sort((a, b) => b.rating - a.rating);
    return arr.slice(0, perPage);
  }, [baseList, brandFilter, minP, maxP, sort, perPage]);

  const title = cat ? categories.find((c) => c.slug === cat)?.name ?? "Shop" : q ? `Search: "${q}"` : "All Products";

  const reset = () => { setBrandFilter([]); setMinP(Math.floor(priceMin)); setMaxP(Math.ceil(priceMax)); };

  const gridCls = grid === 2
    ? "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
    : grid === 3
    ? "grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4";

  return (
    <Layout>
      <div className="container-page py-6">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary"><Home className="w-3.5 h-3.5" /></Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{title}</span>
        </nav>

        <div className="grid lg:grid-cols-[16rem_1fr] gap-5">
          {/* Sidebar filters */}
          <aside className="space-y-4">
            <p className="text-center text-sm font-bold tracking-wide">SHOP BY</p>

            <details open className="bg-card border border-border rounded-md group">
              <summary className="flex items-center justify-between px-4 py-3 font-semibold text-sm cursor-pointer list-none">
                <span>MANUFACTURER</span><ChevronDown className="w-4 h-4 transition group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-3 space-y-2 max-h-72 overflow-auto">
                {allBrands.map((b) => {
                  const count = baseList.filter((p) => p.brand === b).length;
                  const checked = brandFilter.includes(b);
                  return (
                    <label key={b} className="flex items-center justify-between text-sm cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input type="checkbox" checked={checked} onChange={() => setBrandFilter((cur) => checked ? cur.filter((x) => x !== b) : [...cur, b])} />
                        {b}
                      </span>
                      <span className="text-primary font-semibold">({count})</span>
                    </label>
                  );
                })}
                {allBrands.length === 0 && <p className="text-xs text-muted-foreground">No brands</p>}
              </div>
            </details>

            <details open className="bg-card border border-border rounded-md group">
              <summary className="flex items-center justify-between px-4 py-3 font-semibold text-sm cursor-pointer list-none">
                <span>PRICE</span><ChevronDown className="w-4 h-4 transition group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center border border-border rounded px-2 py-1.5 text-sm">
                    <span className="text-muted-foreground mr-1">₹</span>
                    <input type="number" value={minP} onChange={(e) => setMinP(+e.target.value)} className="w-full bg-transparent outline-none" />
                  </div>
                  <div className="flex items-center border border-border rounded px-2 py-1.5 text-sm">
                    <span className="text-muted-foreground mr-1">₹</span>
                    <input type="number" value={maxP} onChange={(e) => setMaxP(+e.target.value)} className="w-full bg-transparent outline-none" />
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full relative">
                  <div className="absolute h-1.5 bg-primary rounded-full" style={{
                    left: `${((minP - priceMin) / Math.max(1, priceMax - priceMin)) * 100}%`,
                    right: `${100 - ((maxP - priceMin) / Math.max(1, priceMax - priceMin)) * 100}%`,
                  }} />
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={reset}>RESET ALL</Button>
              </div>
            </details>
          </aside>

          {/* Main */}
          <section>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-4">{title}</h1>

            <div className="flex items-center justify-between flex-wrap gap-3 bg-card border border-border rounded-md px-3 py-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Grid View:</span>
                {[2, 3, 4].map((n) => (
                  <button key={n} onClick={() => setGrid(n as 2|3|4)} className={`w-8 h-8 rounded border text-sm font-semibold ${grid === n ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>{n}</button>
                ))}
                <button className="w-8 h-8 rounded border border-border hover:bg-muted flex items-center justify-center"><ListIcon className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded border border-border hover:bg-muted flex items-center justify-center"><LayoutGrid className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <label className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Sort By:</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-border rounded px-2 py-1 bg-background">
                    <option value="default">Default</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="rating">Rating</option>
                  </select>
                </label>
                <label className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Show:</span>
                  <select value={perPage} onChange={(e) => setPerPage(+e.target.value)} className="border border-border rounded px-2 py-1 bg-background">
                    <option value={15}>15</option><option value={30}>30</option><option value={60}>60</option>
                  </select>
                </label>
                <span className="hidden sm:inline px-3 py-1 border border-border rounded text-muted-foreground">Product Compare (0)</span>
              </div>
            </div>

            {list.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">No products found.</div>
            ) : (
              <div className={gridCls}>
                {list.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};
export default Shop;

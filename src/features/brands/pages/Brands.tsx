import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { brands, groupBrands, indexLetters } from "@/features/brands/data/brands";

const Brands = () => {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => brands.filter((b) => b.toLowerCase().includes(q.toLowerCase())),
    [q]
  );
  const groups = useMemo(() => groupBrands(filtered), [filtered]);

  return (
    <Layout>
      <div className="container-page py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link> / <span>Brands</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Find Your Favorite Brand</h1>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Live search brands..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-border">
          <span className="text-sm font-semibold mr-2">Brand Index:</span>
          {indexLetters.map((l) => {
            const has = groups[l]?.length > 0;
            return (
              <a
                key={l}
                href={has ? `#letter-${l}` : undefined}
                className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded border ${
                  has
                    ? "border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    : "border-border text-muted-foreground/40 cursor-not-allowed"
                }`}
              >
                {l}
              </a>
            );
          })}
        </div>

        {indexLetters.map((l) =>
          groups[l]?.length ? (
            <section key={l} id={`letter-${l}`} className="mb-10">
              <h2 className="text-2xl font-extrabold mb-4 text-foreground">{l}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-2">
                {groups[l].map((b) => (
                  <Link
                    key={b}
                    to={`/shop?q=${encodeURIComponent(b)}`}
                    className="text-sm text-foreground/80 hover:text-primary hover:underline py-1 truncate"
                  >
                    {b}
                  </Link>
                ))}
              </div>
            </section>
          ) : null
        )}

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No brands found matching "{q}"</p>
        )}
      </div>
    </Layout>
  );
};

export default Brands;
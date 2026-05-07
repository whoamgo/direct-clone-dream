import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Phone, FileText, Menu, X, Sun, Moon, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { useCart } from "@/features/cart/context/CartContext";
import { categories, products } from "@/features/shop/data/products";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
  // Currently hovered top-level category in the "All Categories" mega-menu.
  // Drives the second-column subcategory panel.
  const [hoverCat, setHoverCat] = useState<string | null>(null);

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
  { to: "/brands", label: "Brands" },
  { to: "/blog", label: "Health Resources" },
  { to: "/faq", label: "FAQ" },
  { to: "/privacy", label: "Policy & Services" },
];

export const Header = () => {
  const { theme, toggle } = useTheme();
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openSug, setOpenSug] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const mobWrapRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenSug(false);
    nav(`/shop${search ? `?q=${encodeURIComponent(search)}` : ""}`);
  };

  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return { products: [], categories: [], brands: [] };
    const prod = products.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)).slice(0, 6);
    const cats = categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 4);
    const brands = Array.from(new Set(products.map((p) => p.brand))).filter((b) => b.toLowerCase().includes(q)).slice(0, 4);
    return { products: prod, categories: cats, brands };
  }, [search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node) && !mobWrapRef.current?.contains(e.target as Node)) {
        setOpenSug(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const goTo = (url: string) => { setOpenSug(false); setSearch(""); nav(url); };

  const SuggestPanel = () => (
    suggestions.products.length === 0 && suggestions.categories.length === 0 && suggestions.brands.length === 0 ? (
      <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 p-4 text-sm text-muted-foreground">
        No results for "{search}"
      </div>
    ) : (
      <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-[70vh] overflow-auto">
        {suggestions.categories.length > 0 && (
          <div className="p-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1">Categories</p>
            {suggestions.categories.map((c) => (
              <button key={c.slug} onClick={() => goTo(`/category/${c.slug}`)} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted text-sm">
                <span>{c.icon}</span> {c.name}
              </button>
            ))}
          </div>
        )}
        {suggestions.brands.length > 0 && (
          <div className="p-2 border-t border-border">
            <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1">Brands</p>
            {suggestions.brands.map((b) => (
              <button key={b} onClick={() => goTo(`/shop?q=${encodeURIComponent(b)}`)} className="w-full text-left px-2 py-1.5 rounded hover:bg-muted text-sm">{b}</button>
            ))}
          </div>
        )}
        {suggestions.products.length > 0 && (
          <div className="p-2 border-t border-border">
            <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1">Products</p>
            {suggestions.products.map((p) => (
              <button key={p.id} onClick={() => goTo(`/product/${p.slug}`)} className="w-full text-left flex items-center gap-3 px-2 py-2 rounded hover:bg-muted">
                <div className="w-10 h-10 rounded flex items-center justify-center text-xl shrink-0" style={{ background: p.bg }}>{p.emoji}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.brand} · ₹{p.price}</p>
                </div>
              </button>
            ))}
            <button onClick={submitSearch as any} className="w-full text-center text-sm text-primary font-semibold py-2 hover:bg-muted rounded">View all results →</button>
          </div>
        )}
      </div>
    )
  );

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top utility bar */}
      <div className="bg-topbar text-topbar-foreground text-xs">
        <div className="container-page flex items-center justify-end gap-4 h-8">
          <Link to="/login" className="flex items-center gap-1 hover:text-primary"><User className="w-3 h-3" /> Login</Link>
          <Link to="/account" className="hidden sm:flex items-center gap-1 hover:text-primary"><User className="w-3 h-3" /> My Account</Link>
          <a href="tel:+915011445555" className="hidden sm:flex items-center gap-1 hover:text-primary"><Phone className="w-3 h-3" /> +91 5011445555</a>
          <button onClick={toggle} className="ml-2 p-1 rounded hover:bg-muted" aria-label="Toggle theme">
            {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main header */}
      <div className="container-page py-3 flex items-center gap-3 sm:gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-promo flex items-center justify-center text-primary-foreground font-extrabold">D+</div>
          <div className="leading-tight">
            <div className="font-extrabold text-base sm:text-lg tracking-tight">DIRECT</div>
            <div className="text-[10px] font-bold text-secondary -mt-1">DAWAI</div>
          </div>
        </Link>

        <div ref={wrapRef} className="hidden md:block flex-1 max-w-2xl relative">
          <form onSubmit={submitSearch} className="flex">
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpenSug(true); }}
              onFocus={() => setOpenSug(true)}
              placeholder="Search for medicines, products and more..."
              className="flex-1 h-10 px-4 border border-border rounded-l-md bg-background text-sm outline-none focus:border-primary"
            />
            <Button type="submit" className="rounded-l-none h-10">
              <Search className="w-4 h-4 mr-1" /> Search
            </Button>
          </form>
          {openSug && search.trim() && <SuggestPanel />}
        </div>

        <Link to="/shop" className="hidden lg:flex items-center gap-2 h-10 px-4 border border-secondary text-secondary rounded-md hover:bg-secondary hover:text-secondary-foreground transition font-semibold text-sm">
          <FileText className="w-4 h-4" /> PRESCRIPTION
        </Link>

        <Link to="/wishlist" className="relative p-2 hover:text-primary">
          <Heart className="w-5 h-5" />
        </Link>

        <Link to="/cart" className="relative flex items-center gap-2 hover:text-primary">
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{count}</span>
            )}
          </div>
          <span className="hidden sm:inline text-sm font-semibold">Your cart</span>
        </Link>

        <button className="lg:hidden p-2" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile search */}
      <div ref={mobWrapRef} className="md:hidden container-page pb-3 relative">
        <form onSubmit={submitSearch} className="flex">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpenSug(true); }}
            onFocus={() => setOpenSug(true)}
            placeholder="Search products..."
            className="flex-1 h-10 px-3 border border-border rounded-l-md bg-background text-sm outline-none focus:border-primary"
          />
          <Button type="submit" className="rounded-l-none h-10"><Search className="w-4 h-4" /></Button>
        </form>
        {openSug && search.trim() && <SuggestPanel />}
      </div>

      {/* Categories nav */}
      <div className="border-t border-border bg-background">
        <div className="container-page flex items-center gap-1 h-12 overflow-x-auto scrollbar-hide">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="shrink-0 flex items-center gap-2 h-9 px-4 bg-secondary text-secondary-foreground rounded-md font-semibold text-sm">
                <Menu className="w-4 h-4" /> All Categories <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0 w-[520px] max-w-[90vw]" align="start">
              <div className="grid grid-cols-[220px_1fr] min-h-[320px]">
                {/* Left column: top-level categories */}
                <ul className="border-r border-border py-2 bg-muted/30">
                  {categories.map((c) => (
                    <li
                      key={c.slug}
                      onMouseEnter={() => setHoverCat(c.slug)}
                      className={`group ${hoverCat === c.slug ? "bg-background" : ""}`}
                    >
                      <Link
                        to={`/category/${c.slug}`}
                        className="flex items-center justify-between gap-2 px-3 py-2 text-sm hover:text-primary"
                      >
                        <span className="flex items-center gap-2">
                          <span>{c.icon}</span> {c.name}
                        </span>
                        {c.subs && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                      </Link>
                    </li>
                  ))}
                </ul>
                {/* Right column: subcategories of the hovered category */}
                <div className="p-3">
                  {(() => {
                    const active = categories.find((c) => c.slug === (hoverCat ?? categories[0].slug));
                    if (!active) return null;
                    return (
                      <>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">{active.name}</p>
                        <ul className="grid grid-cols-2 gap-y-1 gap-x-3">
                          {(active.subs ?? []).map((s) => (
                            <li key={s.slug}>
                              <Link
                                to={`/category/${active.slug}?sub=${s.slug}`}
                                className="block text-sm py-1.5 text-foreground/80 hover:text-primary"
                              >
                                {s.name}
                              </Link>
                            </li>
                          ))}
                          {!active.subs?.length && (
                            <li className="text-sm text-muted-foreground">Browse all {active.name}</li>
                          )}
                        </ul>
                      </>
                    );
                  })()}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container-page py-2 flex flex-col">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium border-b border-border last:border-0">
                {l.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium border-b border-border">Login / Register</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

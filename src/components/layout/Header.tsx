import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Phone, FileText, Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { useCart } from "@/context/CartContext";
import { categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const nav = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    nav(`/shop${search ? `?q=${encodeURIComponent(search)}` : ""}`);
  };

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

        <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-2xl">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for medicines, products and more..."
            className="flex-1 h-10 px-4 border border-border rounded-l-md bg-background text-sm outline-none focus:border-primary"
          />
          <Button type="submit" className="rounded-l-none h-10">
            <Search className="w-4 h-4 mr-1" /> Search
          </Button>
        </form>

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
      <form onSubmit={submitSearch} className="md:hidden container-page pb-3 flex">
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 h-10 px-3 border border-border rounded-l-md bg-background text-sm outline-none focus:border-primary"
        />
        <Button type="submit" className="rounded-l-none h-10"><Search className="w-4 h-4" /></Button>
      </form>

      {/* Categories nav */}
      <div className="border-t border-border bg-background">
        <div className="container-page flex items-center gap-1 h-12 overflow-x-auto scrollbar-hide">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="shrink-0 flex items-center gap-2 h-9 px-4 bg-secondary text-secondary-foreground rounded-md font-semibold text-sm">
                <Menu className="w-4 h-4" /> All Categories <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              {categories.map((c) => (
                <DropdownMenuItem key={c.slug} asChild>
                  <Link to={`/category/${c.slug}`} className="flex items-center gap-2">
                    <span>{c.icon}</span> {c.name}
                  </Link>
                </DropdownMenuItem>
              ))}
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

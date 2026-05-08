import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";

/**
 * App-like bottom tab bar shown on mobile only.
 * Highlights the active route and shows a live cart badge.
 */
const tabs = [
  { to: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { to: "/shop", label: "Shop", icon: Search, match: (p: string) => p.startsWith("/shop") || p.startsWith("/category") || p.startsWith("/product") },
  { to: "/wishlist", label: "Wishlist", icon: Heart, match: (p: string) => p.startsWith("/wishlist") },
  { to: "/cart", label: "Cart", icon: ShoppingCart, match: (p: string) => p.startsWith("/cart") || p.startsWith("/checkout") },
  { to: "/account", label: "Account", icon: User, match: (p: string) => p.startsWith("/account") || p.startsWith("/login") || p.startsWith("/register") },
];

export const MobileBottomNav = () => {
  const { pathname } = useLocation();
  const { count } = useCart();
  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_-8px_hsl(220_15%_15%/0.12)]"
    >
      <ul className="grid grid-cols-5 h-14">
        {tabs.map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname);
          const isCart = to === "/cart";
          return (
            <li key={to} className="flex">
              <Link
                to={to}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <span className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`} strokeWidth={active ? 2.5 : 2} />
                  {isCart && count > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[9px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
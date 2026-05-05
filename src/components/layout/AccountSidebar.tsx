import { Link, useLocation } from "react-router-dom";
import { User, UserPlus, LayoutDashboard, MapPin, Heart, Mail, History, Download, RefreshCcw, Coins, Undo2, Receipt } from "lucide-react";

const groups = [
  {
    title: "MY ACCOUNT",
    items: [
      { to: "/login", label: "Login", icon: User },
      { to: "/register", label: "Register", icon: UserPlus },
      { to: "/account", label: "My Account", icon: LayoutDashboard },
      { to: "/account?tab=addresses", label: "Addresses", icon: MapPin },
      { to: "/wishlist", label: "Wish List", icon: Heart },
      { to: "/account?tab=newsletter", label: "Newsletter", icon: Mail },
    ],
  },
  {
    title: "CHECK ORDER",
    items: [
      { to: "/account?tab=orders", label: "Order History", icon: History },
      { to: "/account?tab=downloads", label: "Downloads", icon: Download },
      { to: "/account?tab=recurring", label: "Recurring payments", icon: RefreshCcw },
      { to: "/account?tab=coins", label: "My Coins", icon: Coins },
      { to: "/account?tab=returns", label: "Returns", icon: Undo2 },
      { to: "/account?tab=transactions", label: "Transactions", icon: Receipt },
    ],
  },
];

export const AccountSidebar = () => {
  const { pathname, search } = useLocation();
  const current = pathname + search;
  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-5">
      {groups.map((g) => (
        <div key={g.title} className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-muted font-bold text-sm tracking-wide">{g.title}</div>
          <nav className="divide-y divide-border">
            {g.items.map((it) => {
              const Icon = it.icon;
              const active = current === it.to;
              return (
                <Link
                  key={it.to + it.label}
                  to={it.to}
                  className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition ${active ? "text-primary font-semibold" : "text-foreground/80"}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{it.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </aside>
  );
};
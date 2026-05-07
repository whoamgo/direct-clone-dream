import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "@/features/shop/data/products";

export type CartItem = { product: Product; qty: number };
type Ctx = {
  items: CartItem[];
  wishlist: string[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  toggleWish: (id: string) => void;
  count: number;
  total: number;
};
const CartCtx = createContext<Ctx | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("wishlist") || "[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("cart", JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem("wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  const add = (p: Product, qty = 1) => setItems((cur) => {
    const ex = cur.find((i) => i.product.id === p.id);
    if (ex) return cur.map((i) => i.product.id === p.id ? { ...i, qty: i.qty + qty } : i);
    return [...cur, { product: p, qty }];
  });
  const remove = (id: string) => setItems((cur) => cur.filter((i) => i.product.id !== id));
  const setQty = (id: string, qty: number) => setItems((cur) => cur.map((i) => i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i));
  const clear = () => setItems([]);
  const toggleWish = (id: string) => setWishlist((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.product.price, 0);

  return <CartCtx.Provider value={{ items, wishlist, add, remove, setQty, clear, toggleWish, count, total }}>{children}</CartCtx.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

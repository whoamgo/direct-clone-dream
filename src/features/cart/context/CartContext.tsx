import { ReactNode, useEffect } from "react";
import { createContext, useContext } from "react";
import { Product } from "@/features/shop/data/products";
import { useCart as useReduxCart } from "@/hooks/useCart";

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

/**
 * CartProvider now delegates to the Redux cart slice.
 * This keeps backward compatibility with all existing `useCart()` calls
 * while the real state lives in Redux. When real APIs are connected,
 * only the slice needs to change — no UI code changes.
 */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const redux = useReduxCart();

  const ctx: Ctx = {
    items: redux.items,
    wishlist: redux.wishlist,
    add: redux.add,
    remove: redux.remove,
    setQty: redux.setQty,
    clear: redux.clear,
    toggleWish: redux.toggleWish,
    count: redux.count,
    total: redux.total,
  };

  return <CartCtx.Provider value={ctx}>{children}</CartCtx.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

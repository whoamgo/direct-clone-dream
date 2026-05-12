import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/features/shop/data/products";
import { DEMO } from "@/constants";

export type CartItem = { product: Product; qty: number };

export interface CartState {
  items: CartItem[];
  wishlist: string[];
  count: number;
  total: number;
  syncing: boolean;
  error: string | null;
}

const loadFromStorage = <T>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || "null") || fallback; } catch { return fallback; }
};

const initialState: CartState = {
  items: loadFromStorage("cart", []),
  wishlist: loadFromStorage("wishlist", []),
  count: 0,
  total: 0,
  syncing: false,
  error: null,
};

const recompute = (state: CartState) => {
  state.count = state.items.reduce((s, i) => s + i.qty, 0);
  state.total = state.items.reduce((s, i) => s + i.qty * i.product.price, 0);
};

export const syncCartToServer = createAsyncThunk(
  "cart/sync",
  async (items: { productId: string; qty: number }[], { rejectWithValue }) => {
    if (!DEMO.MODE) {
      try {
        const { ApiService } = await import("@/services/transformers");
        const { ENDPOINTS } = await import("@/services/endpoints");
        return await ApiService.post(ENDPOINTS.CART.SYNC, { items });
      } catch (err: unknown) {
        return rejectWithValue((err as Error).message);
      }
    }
    // Demo mode: no real sync
    return { success: true };
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; qty?: number }>) {
      const { product, qty = 1 } = action.payload;
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({ product, qty });
      }
      recompute(state);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      recompute(state);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    setCartQty(state, action: PayloadAction<{ id: string; qty: number }>) {
      const item = state.items.find((i) => i.product.id === action.payload.id);
      if (item) item.qty = Math.max(1, action.payload.qty);
      recompute(state);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      recompute(state);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    toggleWishlist(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.wishlist.includes(id)) {
        state.wishlist = state.wishlist.filter((x) => x !== id);
      } else {
        state.wishlist.push(id);
      }
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    },
    clearCartError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCartToServer.pending, (state) => { state.syncing = true; state.error = null; })
      .addCase(syncCartToServer.fulfilled, (state) => { state.syncing = false; })
      .addCase(syncCartToServer.rejected, (state, action) => { state.syncing = false; state.error = action.payload as string; });
  },
});

// Initialize computed values from loaded state
recompute(initialState);

export const { addToCart, removeFromCart, setCartQty, clearCart, toggleWishlist, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;

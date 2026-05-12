import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { addToCart, removeFromCart, setCartQty, clearCart, toggleWishlist, syncCartToServer } from "@/store/slices/cartSlice";
import { selectCart, selectCartCount, selectCartTotal, selectWishlist } from "@/store/selectors";
import { Product } from "@/features/shop/data/products";

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const count = useAppSelector(selectCartCount);
  const total = useAppSelector(selectCartTotal);
  const wishlist = useAppSelector(selectWishlist);

  return {
    ...cart,
    count,
    total,
    wishlist,
    add: (product: Product, qty = 1) => dispatch(addToCart({ product, qty })),
    remove: (id: string) => dispatch(removeFromCart(id)),
    setQty: (id: string, qty: number) => dispatch(setCartQty({ id, qty })),
    clear: () => dispatch(clearCart()),
    toggleWish: (id: string) => dispatch(toggleWishlist(id)),
    sync: () => dispatch(syncCartToServer(cart.items.map((i) => ({ productId: i.product.id, qty: i.qty })))),
  };
};

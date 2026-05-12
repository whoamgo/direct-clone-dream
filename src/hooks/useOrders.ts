import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { fetchOrders, fetchOrder, clearSelectedOrder } from "@/store/slices/orderSlice";
import { selectOrders, selectSelectedOrder } from "@/store/selectors";

export const useOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const selectedOrder = useAppSelector(selectSelectedOrder);

  return {
    ...orders,
    selectedOrder,
    fetchOrders: (params?: { page?: number; pageSize?: number }) => dispatch(fetchOrders(params || {})),
    fetchOrder: (id: string) => dispatch(fetchOrder(id)),
    clearSelected: () => dispatch(clearSelectedOrder()),
  };
};

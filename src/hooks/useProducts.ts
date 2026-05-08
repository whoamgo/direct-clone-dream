import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";
import { fetchProducts, fetchProduct, createProduct, updateProduct, deleteProduct, setFilters } from "@/store/slices/productSlice";
import { PaginationParams } from "@/types";

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products);

  return {
    ...products,
    fetchProducts: (params: PaginationParams) => dispatch(fetchProducts(params)),
    fetchProduct: (id: string) => dispatch(fetchProduct(id)),
    createProduct: (data: any) => dispatch(createProduct(data)),
    updateProduct: (id: string, data: any) => dispatch(updateProduct({ id, data })),
    deleteProduct: (id: string) => dispatch(deleteProduct(id)),
    setFilters: (filters: any) => dispatch(setFilters(filters)),
  };
};

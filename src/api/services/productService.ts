import { ApiService } from "../apiService";
import { API_PATHS } from "@/config";
import { PaginationParams, PaginatedResponse } from "@/types";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export class ProductService {
  static async getProducts(params?: PaginationParams) {
    const queryString = params ? `?${ApiService.buildPaginationParams(params)}` : "";
    return ApiService.get<PaginatedResponse<Product>>(
      `${API_PATHS.PRODUCTS.LIST}${queryString}`
    );
  }

  static async getProduct(id: string) {
    return ApiService.get<Product>(API_PATHS.PRODUCTS.GET(id));
  }

  static async createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
    return ApiService.post<Product>(API_PATHS.PRODUCTS.CREATE, data);
  }

  static async updateProduct(id: string, data: Partial<Product>) {
    return ApiService.put<Product>(API_PATHS.PRODUCTS.UPDATE(id), data);
  }

  static async deleteProduct(id: string) {
    return ApiService.delete(API_PATHS.PRODUCTS.DELETE(id));
  }
}

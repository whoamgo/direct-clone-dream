import { ApiResponse, PaginationParams } from "@/types";

export class ApiService {
  static async get<T = unknown>(url: string, config?: { headers?: Record<string, string>; timeout?: number }): Promise<ApiResponse<T>> {
    try {
      const { data } = await import("./apiClient").then((m) => m.default.get<ApiResponse<T>>(url, config));
      return data;
    } catch (error) {
      const { handleApiError } = await import("@/api/errorHandler");
      throw handleApiError(error);
    }
  }

  static async post<T = unknown>(url: string, body?: unknown, config?: { headers?: Record<string, string>; timeout?: number }): Promise<ApiResponse<T>> {
    try {
      const { data } = await import("./apiClient").then((m) => m.default.post<ApiResponse<T>>(url, body, config));
      return data;
    } catch (error) {
      const { handleApiError } = await import("@/api/errorHandler");
      throw handleApiError(error);
    }
  }

  static async put<T = unknown>(url: string, body?: unknown, config?: { headers?: Record<string, string>; timeout?: number }): Promise<ApiResponse<T>> {
    try {
      const { data } = await import("./apiClient").then((m) => m.default.put<ApiResponse<T>>(url, body, config));
      return data;
    } catch (error) {
      const { handleApiError } = await import("@/api/errorHandler");
      throw handleApiError(error);
    }
  }

  static async patch<T = unknown>(url: string, body?: unknown, config?: { headers?: Record<string, string>; timeout?: number }): Promise<ApiResponse<T>> {
    try {
      const { data } = await import("./apiClient").then((m) => m.default.patch<ApiResponse<T>>(url, body, config));
      return data;
    } catch (error) {
      const { handleApiError } = await import("@/api/errorHandler");
      throw handleApiError(error);
    }
  }

  static async delete<T = unknown>(url: string, config?: { headers?: Record<string, string>; timeout?: number }): Promise<ApiResponse<T>> {
    try {
      const { data } = await import("./apiClient").then((m) => m.default.delete<ApiResponse<T>>(url, config));
      return data;
    } catch (error) {
      const { handleApiError } = await import("@/api/errorHandler");
      throw handleApiError(error);
    }
  }

  static buildQuery(params: PaginationParams): string {
    const sp = new URLSearchParams();
    sp.set("page", params.page.toString());
    sp.set("pageSize", params.pageSize.toString());
    if (params.sortBy) sp.set("sortBy", params.sortBy);
    if (params.sortOrder) sp.set("sortOrder", params.sortOrder);
    if (params.search) sp.set("search", params.search);
    return sp.toString();
  }
}

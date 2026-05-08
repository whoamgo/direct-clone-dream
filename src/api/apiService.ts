import axiosInstance from "./axiosInstance";
import { handleApiError } from "./errorHandler";
import { ApiResponse, RequestConfig, PaginationParams } from "@/types";

export class ApiService {
  static async get<T = unknown>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.get<ApiResponse<T>>(url, {
        timeout: config?.timeout,
        headers: config?.headers,
      });
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  }

  static async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.post<ApiResponse<T>>(url, data, {
        timeout: config?.timeout,
        headers: config?.headers,
      });
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  }

  static async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.put<ApiResponse<T>>(url, data, {
        timeout: config?.timeout,
        headers: config?.headers,
      });
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  }

  static async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<T>>(url, data, {
        timeout: config?.timeout,
        headers: config?.headers,
      });
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  }

  static async delete<T = unknown>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<T>>(url, {
        timeout: config?.timeout,
        headers: config?.headers,
      });
      return response.data;
    } catch (error) {
      const formattedError = handleApiError(error);
      throw formattedError;
    }
  }

  static buildPaginationParams(params: PaginationParams): URLSearchParams {
    const searchParams = new URLSearchParams();
    searchParams.append("page", params.page.toString());
    searchParams.append("pageSize", params.pageSize.toString());

    if (params.sortBy) {
      searchParams.append("sortBy", params.sortBy);
    }
    if (params.sortOrder) {
      searchParams.append("sortOrder", params.sortOrder);
    }
    if (params.search) {
      searchParams.append("search", params.search);
    }

    return searchParams;
  }
}

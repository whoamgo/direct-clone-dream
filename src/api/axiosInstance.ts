import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { appConfig, LOCAL_STORAGE_KEYS, API_RETRY } from "@/config";
import { ApiErrorResponse } from "@/types";

let retryCount = 0;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: appConfig.apiTimeout,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    retryCount = 0;
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const config = error.config as InternalAxiosRequestConfig & { retryCount?: number };

    if (!config) {
      return Promise.reject(error);
    }

    config.retryCount = config.retryCount || 0;

    // Handle 401 Unauthorized - Auto logout
    if (error.response?.status === 401) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Retry logic for specific status codes
    if (
      API_RETRY.RETRY_STATUS_CODES.includes(error.response?.status || 0) &&
      config.retryCount < API_RETRY.MAX_RETRIES
    ) {
      config.retryCount += 1;
      const delay = API_RETRY.RETRY_DELAY * Math.pow(2, config.retryCount - 1);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(axiosInstance(config));
        }, delay);
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

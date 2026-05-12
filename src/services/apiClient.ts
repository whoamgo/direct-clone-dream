import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { appConfig, LOCAL_STORAGE_KEYS, API_RETRY } from "@/config";

const apiClient: AxiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: appConfig.apiTimeout,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };
    if (!config) return Promise.reject(error);

    config._retryCount = config._retryCount || 0;

    if (error.response?.status === 401) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (
      API_RETRY.RETRY_STATUS_CODES.includes(error.response?.status || 0) &&
      config._retryCount < API_RETRY.MAX_RETRIES
    ) {
      config._retryCount += 1;
      const delay = API_RETRY.RETRY_DELAY * Math.pow(2, config._retryCount - 1);
      return new Promise((resolve) => setTimeout(() => resolve(apiClient(config)), delay));
    }

    return Promise.reject(error);
  }
);

export default apiClient;

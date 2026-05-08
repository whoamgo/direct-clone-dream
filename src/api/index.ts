export { default as axiosInstance } from "./axiosInstance";
export { ApiService } from "./apiService";
export { handleApiError, getValidationErrorMessage } from "./errorHandler";
export type { FormattedError } from "./errorHandler";

// Services
export { AuthService } from "./services/authService";
export { ProductService, type Product } from "./services/productService";

export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appName: import.meta.env.VITE_APP_NAME,
  env: import.meta.env.VITE_ENV,
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "30000"),
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  enableErrorTracking: import.meta.env.VITE_ENABLE_ERROR_TRACKING === "true",
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  isDevelopment: import.meta.env.VITE_ENV === "development",
  isProduction: import.meta.env.VITE_ENV === "production",
};

export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    REGISTER_OTP: "/auth/register-otp",
  },
  PRESCRIPTIONS: {
    UPLOAD: "/prescriptions/upload",
  },
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
  },
  PRODUCTS: {
    LIST: "/products",
    CREATE: "/products",
    GET: (id: string) => `/products/${id}`,
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network connection error. Please try again.",
  TIMEOUT_ERROR: "Request timeout. Please try again.",
  SERVER_ERROR: "Something went wrong. Please try again later.",
  UNAUTHORIZED: "Unauthorized. Please login again.",
  FORBIDDEN: "You don't have permission to access this resource.",
  NOT_FOUND: "Resource not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  THEME: "theme",
};

export const API_RETRY = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

export const APP_NAME = import.meta.env.VITE_APP_NAME || "DirectDawai";

export const Z_INDEX = {
  BASE: 1,
  DROPDOWN: 10,
  STICKY: 20,
  OVERLAY: 30,
  MODAL: 40,
  POPOVER: 50,
  TOAST: 60,
  TOOLTIP: 70,
  MAX: 100,
} as const;

export const SPACING = {
  BOTTOM_NAV_HEIGHT: "3.5rem",
  STICKY_CTA_HEIGHT: "3.5rem",
  SAFE_AREA_INSET: "env(safe-area-inset-bottom)",
  SAFE_BOTTOM_SPACE: "calc(3.5rem + env(safe-area-inset-bottom))",
  CTA_SAFE_BOTTOM: "calc(7rem + env(safe-area-inset-bottom))",
  TOAST_OFFSET: "calc(3.75rem + env(safe-area-inset-bottom))",
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 15,
  PAGE_SIZE_OPTIONS: [15, 30, 60],
} as const;

export const COUPONS: Record<string, { type: "percent" | "flat" | "shipping"; value: number; minOrder?: number }> = {
  WELCOME10: { type: "percent", value: 10, minOrder: 0 },
  SAVE100: { type: "flat", value: 100, minOrder: 500 },
  FREESHIP: { type: "shipping", value: 0, minOrder: 0 },
};

export const SHIPPING = {
  FREE_THRESHOLD: 499,
  STANDARD_FEE: 49,
  TAX_RATE: 0.05,
} as const;

export const DEMO = {
  OTP: "123456",
  MODE: true,
  LATENCY_MS: 600,
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  ACCEPTED_TYPES: ["application/pdf"],
} as const;

export const ROUTES = {
  HOME: "/",
  SHOP: "/shop",
  CATEGORY: "/category/:slug",
  PRODUCT: "/product/:slug",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: "/order-confirmation/:id",
  WISHLIST: "/wishlist",
  LOGIN: "/login",
  REGISTER: "/register",
  ACCOUNT: "/account",
  ABOUT: "/about",
  CONTACT: "/contact",
  FAQ: "/faq",
  BRANDS: "/brands",
  BLOG: "/blog",
  BLOG_POST: "/blog/:slug",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  RETURNS: "/returns",
  SHIPPING_POLICY: "/shipping",
} as const;

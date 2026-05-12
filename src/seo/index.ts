export interface SeoMeta {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: "summary" | "summary_large_image";
  noIndex?: boolean;
  structuredData?: Record<string, unknown>;
}

const SITE_NAME = import.meta.env.VITE_APP_NAME || "DirectDawai";
const DEFAULT_OG_IMAGE = "/og-image.png";
const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

export const seo = {
  set(meta: SeoMeta) {
    const title = `${meta.title} | ${SITE_NAME}`;
    const desc = meta.description || "";
    const canonical = meta.canonical || `${BASE_URL}${window.location.pathname}`;
    const ogImage = meta.ogImage || DEFAULT_OG_IMAGE;

    document.title = title;

    this.setMeta("description", desc);
    this.setMeta("keywords", meta.keywords?.join(", ") || "");
    this.setLink("canonical", canonical);

    // Open Graph
    this.setProperty("og:title", title);
    this.setProperty("og:description", desc);
    this.setProperty("og:type", meta.ogType || "website");
    this.setProperty("og:image", ogImage);
    this.setProperty("og:url", meta.ogUrl || canonical);
    this.setProperty("og:site_name", SITE_NAME);

    // Twitter
    this.setProperty("twitter:card", meta.twitterCard || "summary_large_image");
    this.setProperty("twitter:title", title);
    this.setProperty("twitter:description", desc);
    this.setProperty("twitter:image", ogImage);

    // Robots
    if (meta.noIndex) {
      this.setMeta("robots", "noindex, nofollow");
    } else {
      this.removeMeta("robots");
    }

    // Structured Data
    if (meta.structuredData) {
      this.setStructuredData(meta.structuredData);
    }
  },

  setMeta(name: string, content: string) {
    let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement("meta");
      el.name = name;
      document.head.appendChild(el);
    }
    el.content = content;
  },

  setProperty(property: string, content: string) {
    let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("property", property);
      document.head.appendChild(el);
    }
    el.content = content;
  },

  setLink(rel: string, href: string) {
    let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement("link");
      el.rel = rel;
      document.head.appendChild(el);
    }
    el.href = href;
  },

  removeMeta(name: string) {
    document.querySelector(`meta[name="${name}"]`)?.remove();
  },

  setStructuredData(data: Record<string, unknown>) {
    let el = document.getElementById("structured-data") as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = "structured-data";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  },
};

export const SEO_META: Record<string, SeoMeta> = {
  home: {
    title: "Online Pharmacy & Health Store",
    description: "Shop medicines, ayurveda, vitamins, fitness supplements & more at the best prices. Free delivery on orders above Rs 499.",
    keywords: ["online pharmacy", "medicines", "ayurveda", "vitamins", "health store"],
    ogType: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": BASE_URL,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${BASE_URL}/shop?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  },
  shop: {
    title: "Shop All Products",
    description: "Browse our complete range of medicines, health products, ayurveda, vitamins, and fitness supplements.",
    keywords: ["shop", "products", "pharmacy", "health"],
  },
  cart: {
    title: "Shopping Cart",
    description: "Review your cart and proceed to checkout.",
    noIndex: true,
  },
  checkout: {
    title: "Checkout",
    description: "Complete your order securely.",
    noIndex: true,
  },
  login: {
    title: "Login",
    description: "Sign in to your account to track orders and manage prescriptions.",
    noIndex: true,
  },
  register: {
    title: "Create Account",
    description: "Register for a new account to enjoy exclusive deals and faster checkout.",
    noIndex: true,
  },
  about: {
    title: "About Us",
    description: "Learn about our mission to make healthcare accessible and affordable for everyone.",
  },
  contact: {
    title: "Contact Us",
    description: "Get in touch with our team for support, queries, or feedback.",
  },
  faq: {
    title: "Frequently Asked Questions",
    description: "Find answers to common questions about orders, shipping, returns, and more.",
  },
  brands: {
    title: "Our Brands",
    description: "Explore trusted healthcare brands available on our platform.",
  },
  blog: {
    title: "Health Resources & Articles",
    description: "Read expert health articles, wellness tips, and medicine guides.",
    ogType: "article",
  },
  wishlist: {
    title: "Wishlist",
    description: "Your saved products and wishlisted items.",
    noIndex: true,
  },
  account: {
    title: "My Account",
    description: "Manage your profile, orders, and prescriptions.",
    noIndex: true,
  },
  privacy: {
    title: "Privacy Policy",
    description: "Read our privacy policy to understand how we protect your data.",
  },
  terms: {
    title: "Terms & Conditions",
    description: "Our terms and conditions governing the use of this website and services.",
  },
  returns: {
    title: "Returns & Refunds",
    description: "Learn about our return and refund policies.",
  },
  shipping: {
    title: "Shipping Policy",
    description: "Shipping information, delivery times, and tracking details.",
  },
  notFound: {
    title: "Page Not Found",
    description: "The page you are looking for does not exist.",
    noIndex: true,
  },
};

export const useSeo = (key: string, overrides?: Partial<SeoMeta>) => {
  const base = SEO_META[key];
  if (base) {
    seo.set({ ...base, ...overrides });
  }
};

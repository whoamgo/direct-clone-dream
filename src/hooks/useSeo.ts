import { useEffect } from "react";
import { seo, SeoMeta, SEO_META } from "@/seo";

export const useSeo = (key: string, overrides?: Partial<SeoMeta>) => {
  useEffect(() => {
    const base = SEO_META[key];
    if (base) {
      seo.set({ ...base, ...overrides });
    }
  }, [key]);
};

import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";

export const Layout = ({
  children,
  hasStickyCta = false,
}: {
  children: ReactNode;
  /** Set true on pages that render their own sticky CTA above the bottom nav (e.g. ProductDetails). */
  hasStickyCta?: boolean;
}) => (
  <div className="min-h-screen flex flex-col bg-background">
    <Header />
    <main className={`flex-1 ${hasStickyCta ? "mobile-cta-safe" : "mobile-nav-safe"}`}>
      {children}
    </main>
    <Footer />
    <MobileBottomNav />
  </div>
);

import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeProvider";
import { store } from "@/store/store";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { GlobalLoader } from "@/components/feedback/GlobalLoader";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Index = lazy(() => import("./pages/Index"));
const Shop = lazy(() => import("@/features/shop/pages/Shop"));
const ProductDetails = lazy(() => import("@/features/shop/pages/ProductDetails"));
const Cart = lazy(() => import("@/features/cart/pages/Cart"));
const Checkout = lazy(() => import("@/features/cart/pages/Checkout"));
const OrderConfirmation = lazy(() => import("@/features/cart/pages/OrderConfirmation"));
const Wishlist = lazy(() => import("@/features/account/pages/Wishlist"));
const Login = lazy(() => import("@/features/account/pages/Login"));
const Register = lazy(() => import("@/features/account/pages/Register"));
const Account = lazy(() => import("@/features/account/pages/Account"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Brands = lazy(() => import("@/features/brands/pages/Brands"));
const Blog = lazy(() => import("@/features/blog/pages/Blog"));
const BlogDetails = lazy(() => import("@/features/blog/pages/BlogDetails"));
const Privacy = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Terms })));
const Returns = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Returns })));
const Shipping = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Shipping })));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin" />
  </div>
);

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <GlobalLoader />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/category/:slug" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/brands" element={<Brands />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogDetails />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;

import { Layout } from "@/components/layout/Layout";
import { AccountSidebar } from "@/features/account/components/AccountSidebar";
import { ProductCard } from "@/features/shop/components/ProductCard";
import { useCart } from "@/features/cart/context/CartContext";
import { products } from "@/features/shop/data/products";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Wishlist = () => {
  const { wishlist } = useCart();
  const list = products.filter((p) => wishlist.includes(p.id));
  return (
    <Layout>
      <div className="container-page py-6">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary"><Home className="w-3.5 h-3.5" /></Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Wish List</span>
        </nav>
        <div className="grid lg:grid-cols-[1fr_18rem] gap-5">
          <section>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-6">My Wishlist</h1>
            {list.length === 0 ? (
              <div className="bg-card border border-border rounded-lg py-20 text-center">
                <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
                <Button asChild><Link to="/shop">Browse Products</Link></Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {list.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </section>
          <AccountSidebar />
        </div>
      </div>
    </Layout>
  );
};
export default Wishlist;

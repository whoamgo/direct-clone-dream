import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/shop/ProductCard";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Wishlist = () => {
  const { wishlist } = useCart();
  const list = products.filter((p) => wishlist.includes(p.id));
  return (
    <Layout>
      <div className="container-page py-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-6">My Wishlist</h1>
        {list.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
            <Button asChild><Link to="/shop">Browse Products</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
};
export default Wishlist;

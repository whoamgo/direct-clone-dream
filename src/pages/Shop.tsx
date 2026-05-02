import { useMemo } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/shop/ProductCard";
import { products, categories } from "@/data/products";

const Shop = () => {
  const [params] = useSearchParams();
  const { slug } = useParams();
  const q = params.get("q")?.toLowerCase() ?? "";
  const cat = slug;
  const list = useMemo(() => products.filter((p) =>
    (!cat || p.category === cat) &&
    (!q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
  ), [q, cat]);
  const title = cat ? categories.find((c) => c.slug === cat)?.name ?? "Shop" : q ? `Search: "${q}"` : "All Products";

  return (
    <Layout>
      <div className="container-page py-6">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{list.length} product{list.length !== 1 ? "s" : ""} found</p>
          </div>
        </div>
        {list.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
};
export default Shop;

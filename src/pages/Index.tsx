import { Layout } from "@/components/layout/Layout";
import { HeroBanner } from "@/features/shop/components/HeroBanner";
import { CategoryStrip } from "@/features/shop/components/CategoryStrip";
import { PromoStrip } from "@/features/shop/components/PromoStrip";
import { ProductRow } from "@/features/shop/components/ProductRow";
import { byCategory, bestSellers, newAdditions } from "@/features/shop/data/products";

const Index = () => (
  <Layout>
    <HeroBanner />
    <CategoryStrip />
    <ProductRow title="Best Selling Products" products={bestSellers()} viewAllHref="/shop" />
    <ProductRow title="Ayurveda Products" products={byCategory("ayurveda")} viewAllHref="/category/ayurveda" />
    <ProductRow title="Homeopathy Products" products={byCategory("homeopathy")} viewAllHref="/category/homeopathy" />
    <ProductRow title="Vitamin & Nutritions Products" products={byCategory("vitamins-and-nutrition")} viewAllHref="/category/vitamins-and-nutrition" />
    <ProductRow title="Nutritional Drinks" products={byCategory("nutritional-drinks")} viewAllHref="/category/nutritional-drinks" />
    <ProductRow title="Your Health, Our New Additions" products={newAdditions()} viewAllHref="/shop" />
    <ProductRow title="Fitness Supplements" products={byCategory("fitness-supplements")} viewAllHref="/category/fitness-supplements" />
    <ProductRow title="Sexual Wellness Products" products={byCategory("sexual-wellness")} viewAllHref="/category/sexual-wellness" />
    <ProductRow title="Stomach & Pain Care Products" products={byCategory("stomach-pain-care")} viewAllHref="/category/stomach-pain-care" />
    <ProductRow title="Skin Care Products" products={byCategory("skin-care")} viewAllHref="/category/skin-care" />
    <ProductRow title="Hair Care Products" products={byCategory("hair-care")} viewAllHref="/category/hair-care" />
    <ProductRow title="Oral Care Products" products={byCategory("oral-care")} viewAllHref="/category/oral-care" />
    <ProductRow title="Sanitizers & Hand Wash Products" products={byCategory("sanitizers-handwash")} viewAllHref="/category/sanitizers-handwash" />
    <PromoStrip />
  </Layout>
);

export default Index;

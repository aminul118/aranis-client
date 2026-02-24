import ProductCard from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/services/product/product';
import Link from 'next/link';

const FeaturedProducts = async () => {
  const { data } = await getProducts({ featured: 'true' });
  const featuredItems = data?.slice(0, 8) || [];

  if (featuredItems.length === 0) return null;

  return (
    <section className="bg-muted/50 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
              Featured Excellence
            </h2>
            <p className="text-muted-foreground">
              Our hand-picked selections for this season
            </p>
          </div>
          <Button
            asChild
            variant="link"
            className="text-primary hover:text-primary/80 h-auto p-0 font-bold tracking-widest uppercase"
          >
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredItems.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

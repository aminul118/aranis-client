import Grid from '@/components/common/Grid';
import ProductCard from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
import { getBestSellingProducts } from '@/services/product/product';
import Link from 'next/link';

const BestSellingProducts = async () => {
  const { data: products = [] } = await getBestSellingProducts();

  if (products.length === 0) return null;

  return (
    <section className="bg-secondary/30 border-border/50 border-y py-24 backdrop-blur-3xl">
      <div className="container mx-auto px-4">
        <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div>
            <div className="text-primary mb-2 flex items-center gap-3">
              <div className="bg-primary h-0.5 w-12 rounded-full" />
              <span className="text-xs font-black tracking-[0.3em] uppercase">
                Bestsellers
              </span>
            </div>
            <h2 className="text-foreground mb-4 text-3xl font-black tracking-tighter md:text-5xl">
              Most <span className="text-primary">Wanted</span> Now
            </h2>
            <p className="text-muted-foreground text-lg">
              The products everyone is talking about
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-primary/20 text-primary hover:bg-primary transform rounded-full px-8 font-bold transition-all hover:scale-105 hover:text-white active:scale-95"
          >
            <Link href="/shop?sort=-soldCount">Explore Collection</Link>
          </Button>
        </div>

        <Grid cols={4} className="gap-x-8 gap-y-12">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </Grid>
      </div>
    </section>
  );
};

export default BestSellingProducts;

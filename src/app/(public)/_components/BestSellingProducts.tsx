import Grid from '@/components/common/Grid';
import ProductCard from '@/components/common/ProductCard';
import { getBestSellingProducts } from '@/services/product/product';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AnimatedSection from './AnimatedSection';

const BestSellingProducts = async () => {
  const { data: products = [] } = await getBestSellingProducts();

  if (products.length === 0) return null;

  return (
    <section className="bg-secondary/30 border-border/50 border-y py-10 backdrop-blur-3xl md:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection className="mb-8 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <div className="text-primary mb-2 flex items-center gap-3">
              <div className="bg-primary h-0.5 w-12 rounded-full" />
              <span className="text-xs font-black tracking-[0.3em] uppercase">
                Bestsellers
              </span>
            </div>
            <h2 className="text-foreground mb-4 text-2xl font-black tracking-tighter md:text-4xl">
              Most <span className="text-primary">Wanted</span> Items
            </h2>
            <p className="text-muted-foreground text-base">
              Our most popular pieces based on what customers are buying right
              now
            </p>
          </div>
          <Link
            href="/shop?sort=-soldCount"
            className="group border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-background flex items-center gap-3 rounded-full border px-8 py-3 text-sm font-black tracking-widest uppercase transition-all"
          >
            Explore Collection
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </AnimatedSection>

        <Grid cols={4} className="gap-x-4 gap-y-6 md:gap-x-8 md:gap-y-12">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </Grid>
      </div>
    </section>
  );
};

export default BestSellingProducts;

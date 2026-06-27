import Grid from '@/components/common/Grid';
import ProductCard from '@/components/common/ProductCard';
import { getNewArrivals } from '@/services/product/product';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AnimatedSection from '../../../components/common/AnimatedSection';

const NewArrivals = async () => {
  const { data: products = [] } = await getNewArrivals();

  if (products.length === 0) return null;

  return (
    <section className="bg-background py-10 md:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection className="mb-8 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <div className="text-primary mb-2 flex items-center gap-3">
              <div className="bg-primary h-0.5 w-12 rounded-full" />
              <span className="text-xs font-black tracking-[0.3em] uppercase">
                Just Landed
              </span>
            </div>
            <h2 className="text-foreground mb-4 text-2xl font-black tracking-tighter md:text-4xl">
              New <span className="text-primary">Arrivals</span>
            </h2>
            <p className="text-muted-foreground text-base">
              Explore our latest collection of premium contemporary apparel
            </p>
          </div>
          <Link
            href="/shop?sort=-createdAt"
            className="group border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-background flex items-center gap-3 rounded-full border px-8 py-3 text-sm font-black tracking-widest uppercase transition-all"
          >
            View All New
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </AnimatedSection>

        <Grid cols={4} className="gap-x-4 gap-y-6 md:gap-x-8 md:gap-y-12">
          {products.map((product, index) => (
            <AnimatedSection key={product._id} variant="fadeUp">
              <ProductCard product={product} index={index} />
            </AnimatedSection>
          ))}
        </Grid>
      </div>
    </section>
  );
};

export default NewArrivals;

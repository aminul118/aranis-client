import { Button } from '@/components/ui/button';
import { getTopRatedProducts } from '@/services/product/product';
import Link from 'next/link';
import AnimatedSection from './AnimatedSection';
import TopRatedSwiper from './TopRatedSwiper';

const TopRatedProducts = async () => {
  const { data: products = [] } = await getTopRatedProducts();

  if (products.length === 0) return null;

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-foreground mb-4 text-3xl font-black tracking-tighter md:text-5xl">
              The <span className="text-primary">Highest</span> Rating
            </h2>
            <p className="text-muted-foreground text-lg">
              Top selections rated by our worldwide community
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="text-muted-foreground hover:text-primary h-auto p-0 text-xs font-black tracking-[0.2em] uppercase"
          >
            <Link href="/shop?sort=-rating">View All Ranked</Link>
          </Button>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <TopRatedSwiper products={products} />
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TopRatedProducts;

import ProductCard from '@/components/common/ProductCard';
import { getProducts } from '@/services/product/product';
import { Gift } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Special Offers | Aranis',
  description:
    'Discover exclusive deals and seasonal offers on our premium collections.',
};

interface Props {
  searchParams: Promise<{ tag?: string }>;
}

const OffersPage = async ({ searchParams }: Props) => {
  const { tag } = await searchParams;

  const query: Record<string, string> = {
    isOffer: 'true',
    limit: '50',
  };

  if (tag) {
    query.offerTag = tag;
  }

  // Fetch products that are marked as offers
  const { data: products } = await getProducts(query);

  return (
    <div className="bg-background min-h-screen pt-28 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <Gift size={32} />
          </div>
          <h1 className="text-foreground mb-4 text-4xl font-black tracking-tight uppercase md:text-5xl">
            {tag || 'Special Offers'}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            {tag
              ? `Exclusive pieces from our ${tag} collection at unbeatable prices.`
              : 'Browse our latest discounted items and limited-time deals.'}
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="border-border/50 rounded-3xl border border-dashed py-24 text-center">
            <p className="text-muted-foreground font-medium">
              No active offers found for this category at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;

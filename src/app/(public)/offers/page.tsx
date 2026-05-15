import OfferList from '@/components/modules/Public/Offer/OfferList';
import { getProducts } from '@/services/product/product';
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

  // Fetch products that are marked as offers (Server-side)
  const { data: products } = await getProducts(query);

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <OfferList products={products || []} tag={tag} />
    </div>
  );
};

export default OffersPage;

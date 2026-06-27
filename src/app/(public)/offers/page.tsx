import { getCategories } from '@/services/category/category';
import { getColors } from '@/services/color/color';
import { getActiveOffer, getOffers } from '@/services/offer/offer';
import { getProductPriceRange, getProducts } from '@/services/product/product';
import { getSizes } from '@/services/size/size';
import { Metadata } from 'next';
import ShopContent from '../shop/_components/ShopContent';
import OfferCountdown from './_components/OfferCountdown';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Special Offers | Aranis',
  description:
    'Discover exclusive deals and seasonal offers on our premium collections.',
};

interface Props {
  searchParams: Promise<Record<string, string>>;
}

const OffersPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const tag = resolvedSearchParams.tag;
  let activeOffer = null;

  if (tag) {
    const res = await getOffers({ tag });
    if (res.data && res.data.length > 0) {
      activeOffer = res.data[0];
    }
  }

  // If no tag provided, or the provided tag was invalid/expired, try to get the active offer
  if (!activeOffer) {
    const res = await getActiveOffer();
    if (res.data) {
      activeOffer = res.data;
    }
  }

  // Use the verified active offer's tag, otherwise fall back to undefined to show all offers
  const verifiedTag = activeOffer?.tag;

  const page = resolvedSearchParams.page || '1';
  const limit = '20';

  const query: Record<string, string> = {
    ...resolvedSearchParams,
    isOffer: 'true',
    page,
    limit,
  };

  if (verifiedTag) {
    query.offerTag = verifiedTag;
  }

  const [
    { data: products, meta },
    { data: dbCategories },
    { data: dbColors },
    { data: dbSizes },
    { data: priceRange },
  ] = await Promise.all([
    getProducts(query),
    getCategories({ limit: '1000' }),
    getColors({ limit: '1000' }),
    getSizes({ limit: '1000' }),
    getProductPriceRange(),
  ]);

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      {activeOffer && <OfferCountdown offer={activeOffer} />}
      <ShopContent
        isOfferPage={true}
        offerTag={verifiedTag}
        offerName={activeOffer?.name}
        products={products || []}
        meta={meta || null}
        dbCategories={dbCategories || []}
        dbColors={dbColors || []}
        dbSizes={dbSizes || []}
        priceRange={priceRange || null}
      />
    </div>
  );
};

export default OffersPage;

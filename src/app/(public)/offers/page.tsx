import { getActiveOffer, getOffers } from '@/services/offer/offer';
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
  searchParams: Promise<{ tag?: string }>;
}

const OffersPage = async ({ searchParams }: Props) => {
  const { tag } = await searchParams;
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

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      {activeOffer && <OfferCountdown offer={activeOffer} />}
      <ShopContent isOfferPage={true} offerTag={verifiedTag} />
    </div>
  );
};

export default OffersPage;

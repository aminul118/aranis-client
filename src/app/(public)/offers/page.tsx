import { getOffers } from '@/services/offer/offer';
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
  } else {
    // Try to get any active offer if no specific tag is provided
    const res = await getOffers({ isActive: true });
    if (res.data && res.data.length > 0) {
      activeOffer = res.data[0];
    }
  }

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      {activeOffer && <OfferCountdown offer={activeOffer} />}
      <ShopContent isOfferPage={true} offerTag={tag} />
    </div>
  );
};

export default OffersPage;

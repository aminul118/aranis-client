import { Metadata } from 'next';
import ShopContent from '../shop/_components/ShopContent';

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

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <ShopContent isOfferPage={true} offerTag={tag} />
    </div>
  );
};

export default OffersPage;

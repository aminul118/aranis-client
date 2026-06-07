import OfferTable from '@/app/(dashboard)/admin/offers/_components/OfferTable';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getOffers } from '@/services/offer/offer';
import { SearchParams } from '@/types';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const OffersAdminPage = async ({ searchParams }: SearchParams) => {
  const params = await cleanSearchParams(searchParams);
  const { data, meta } = await getOffers(params);

  return <OfferTable offers={data || []} meta={meta} />;
};

export default OffersAdminPage;

export const metadata: Metadata = {
  title: 'Offers Management | Admin Portal',
};

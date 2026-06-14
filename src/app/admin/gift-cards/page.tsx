import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { Button } from '@/components/ui/button';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getGiftCards } from '@/services/giftcard/giftcard';
import { SearchParams } from '@/types';
import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import GiftCardsTable from './_components/GiftCardsTable';

export const dynamic = 'force-dynamic';

const GiftCardPage = async ({ searchParams }: SearchParams) => {
  const params = await cleanSearchParams(searchParams);
  const { data, meta } = await getGiftCards(params);

  return (
    <ClientTableWrapper
      tableTitle="Gift Cards"
      meta={meta}
      action={<Actions />}
    >
      <GiftCardsTable giftCards={data || []} />
    </ClientTableWrapper>
  );
};

export default GiftCardPage;

const Actions = () => {
  return (
    <Link href="/admin/gift-cards/create">
      <Button>
        <Plus className="mr-2 h-4 w-4" /> Add Gift Card
      </Button>
    </Link>
  );
};

export const metadata: Metadata = {
  title: 'Gift Cards | Admin Portal',
};

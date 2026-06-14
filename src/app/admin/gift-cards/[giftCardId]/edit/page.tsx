import BackButton from '@/components/common/BackButton';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { getSingleGiftCard } from '@/services/giftcard/giftcard';
import { Metadata } from 'next';
import GiftCardForm from '../../_components/GiftCardForm';

export const dynamic = 'force-dynamic';

const EditGiftCardPage = async ({
  params,
}: {
  params: Promise<{ giftCardId: string }>;
}) => {
  const { giftCardId } = await params;
  const res = await getSingleGiftCard(giftCardId);

  return (
    <ClientTableWrapper
      tableTitle="Edit Gift Card"
      action={<BackButton label="Back to Gift Cards" />}
    >
      <div className="mx-auto max-w-4xl p-6">
        <GiftCardForm giftCard={res?.data} />
      </div>
    </ClientTableWrapper>
  );
};

export default EditGiftCardPage;

export const metadata: Metadata = {
  title: 'Edit Gift Card | Admin Portal',
};

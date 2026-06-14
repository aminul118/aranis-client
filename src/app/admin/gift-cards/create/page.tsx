import BackButton from '@/components/common/BackButton';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { Metadata } from 'next';
import GiftCardForm from '../_components/GiftCardForm';

export const dynamic = 'force-dynamic';

const CreateGiftCardPage = () => {
  return (
    <ClientTableWrapper
      tableTitle="Create Gift Card"
      action={<BackButton label="Back to Gift Cards" />}
    >
      <div className="mx-auto max-w-4xl p-6">
        <GiftCardForm />
      </div>
    </ClientTableWrapper>
  );
};

export default CreateGiftCardPage;

export const metadata: Metadata = {
  title: 'Create Gift Card | Admin Portal',
};

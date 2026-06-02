import MiniBannerForm from '@/app/(dashboard)/admin/mini-banners/_components/MiniBannerForm';
import BackButton from '@/components/common/BackButton';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { Metadata } from 'next';

export default function CreateMiniBannerPage() {
  return (
    <ClientTableWrapper tableTitle="Add Mini Banner" action={<BackButton />}>
      <MiniBannerForm />
    </ClientTableWrapper>
  );
}

export const metadata: Metadata = {
  title: 'Add Mini Banner | Admin Portal',
};

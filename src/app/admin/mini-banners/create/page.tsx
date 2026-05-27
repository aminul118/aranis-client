import MiniBannerForm from '@/app/admin/mini-banners/_components/MiniBannerForm';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { Metadata } from 'next';

export default function CreateMiniBannerPage() {
  return (
    <ClientTableWrapper tableTitle="Add Mini Banner">
      <MiniBannerForm />
    </ClientTableWrapper>
  );
}

export const metadata: Metadata = {
  title: 'Add Mini Banner | Admin Portal',
};

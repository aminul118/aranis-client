import MiniBannerForm from '@/app/admin/mini-banners/_components/MiniBannerForm';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { getSingleMiniBanner } from '@/services/hero-banner/hero-banner';
import { Metadata } from 'next';

export default async function EditMiniBannerPage({
  params,
}: {
  params: { bannerId: string };
}) {
  const { bannerId } = await params;
  const { data } = await getSingleMiniBanner(bannerId);

  return (
    <ClientTableWrapper tableTitle="Edit Mini Banner">
      <MiniBannerForm banner={data} />
    </ClientTableWrapper>
  );
}

export const metadata: Metadata = {
  title: 'Edit Mini Banner | Admin Portal',
};

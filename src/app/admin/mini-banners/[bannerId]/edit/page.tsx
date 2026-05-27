import MiniBannerForm from '@/app/admin/mini-banners/_components/MiniBannerForm';
import BackButton from '@/components/common/BackButton';
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
    <ClientTableWrapper tableTitle="Edit Mini Banner" action={<BackButton />}>
      <MiniBannerForm banner={data} />
    </ClientTableWrapper>
  );
}

export const metadata: Metadata = {
  title: 'Edit Mini Banner | Admin Portal',
};

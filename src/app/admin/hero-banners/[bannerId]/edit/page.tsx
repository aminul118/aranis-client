import HeroBannerForm from '@/app/admin/hero-banners/_components/HeroBannerForm';
import BackButton from '@/components/common/BackButton';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { getSingleHeroBanner } from '@/services/hero-banner/hero-banner';
import { Metadata } from 'next';

export default async function EditHeroBannerPage({
  params,
}: {
  params: { bannerId: string };
}) {
  const { bannerId } = await params;
  const { data } = await getSingleHeroBanner(bannerId);

  return (
    <ClientTableWrapper tableTitle="Edit Hero Banner" action={<BackButton />}>
      <HeroBannerForm banner={data} />
    </ClientTableWrapper>
  );
}

export const metadata: Metadata = {
  title: 'Edit Hero Banner | Admin Portal',
};

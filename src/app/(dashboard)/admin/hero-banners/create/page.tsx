import HeroBannerForm from '@/app/(dashboard)/admin/hero-banners/_components/HeroBannerForm';
import BackButton from '@/components/common/BackButton';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export default function CreateHeroBannerPage() {
  return (
    <ClientTableWrapper tableTitle="Add Hero Banner" action={<BackButton />}>
      <HeroBannerForm />
    </ClientTableWrapper>
  );
}

export const metadata: Metadata = {
  title: 'Add Hero Banner | Admin Portal',
};

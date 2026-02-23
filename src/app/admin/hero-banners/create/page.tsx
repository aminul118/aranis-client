import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import HeroBannerForm from '@/components/modules/Admin/hero-banner/HeroBannerForm';
import { Metadata } from 'next';

export default function CreateHeroBannerPage() {
    return (
        <ClientTableWrapper tableTitle="Add Hero Banner">
            <HeroBannerForm />
        </ClientTableWrapper>
    );
}

export const metadata: Metadata = {
    title: 'Add Hero Banner | Admin Portal',
};

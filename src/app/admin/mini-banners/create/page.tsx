import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import MiniBannerForm from '@/components/modules/Admin/hero-banner/MiniBannerForm';
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

import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import PopupBannerForm from '@/components/modules/Admin/popup-banner/PopupBannerForm';
import { Metadata } from 'next';

export default function CreatePopupBannerPage() {
  return (
    <ClientTableWrapper tableTitle="Add Popup Banner">
      <PopupBannerForm />
    </ClientTableWrapper>
  );
}

export const metadata: Metadata = {
  title: 'Add Popup Banner | Admin Portal',
};

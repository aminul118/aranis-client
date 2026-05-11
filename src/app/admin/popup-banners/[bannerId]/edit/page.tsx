import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import PopupBannerForm from '@/components/modules/Admin/popup-banner/PopupBannerForm';
import { getSinglePopupBanner } from '@/services/popup-banner/popup-banner';
import { Metadata } from 'next';

export default async function EditPopupBannerPage({
  params,
}: {
  params: { bannerId: string };
}) {
  const { bannerId } = await params;
  const { data } = await getSinglePopupBanner(bannerId);

  return (
    <ClientTableWrapper tableTitle="Edit Popup Banner">
      <PopupBannerForm banner={data} />
    </ClientTableWrapper>
  );
}

export const metadata: Metadata = {
  title: 'Edit Popup Banner | Admin Portal',
};

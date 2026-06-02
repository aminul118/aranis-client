import PopupBannerTable from '@/app/(dashboard)/admin/popup-banners/_components/PopupBannerTable';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getPopupBanners } from '@/services/popup-banner/popup-banner';
import { SearchParams } from '@/types';
import { Metadata } from 'next';

const PopupBannersAdminPage = async ({ searchParams }: SearchParams) => {
  const params = await cleanSearchParams(searchParams);
  const { data, meta } = await getPopupBanners(params);

  return <PopupBannerTable banners={data || []} meta={meta} />;
};

export default PopupBannersAdminPage;

export const metadata: Metadata = {
  title: 'Popup Banners | Admin Portal',
};

import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import PopupBannerTable from '@/components/modules/Admin/popup-banner/PopupBannerTable';
import { Button } from '@/components/ui/button';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getPopupBanners } from '@/services/popup-banner/popup-banner';
import { SearchParams } from '@/types';
import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

const PopupBannersAdminPage = async ({ searchParams }: SearchParams) => {
  const params = await cleanSearchParams(searchParams);
  const { data, meta } = await getPopupBanners(params);

  return (
    <ClientTableWrapper
      tableTitle="Popup Banners"
      meta={meta}
      action={<Actions />}
    >
      <PopupBannerTable banners={data || []} />
    </ClientTableWrapper>
  );
};

export default PopupBannersAdminPage;

const Actions = () => (
  <Link href="/admin/popup-banners/create">
    <Button>
      <Plus className="mr-2 h-4 w-4" /> Add Popup Banner
    </Button>
  </Link>
);

export const metadata: Metadata = {
  title: 'Popup Banners | Admin Portal',
};

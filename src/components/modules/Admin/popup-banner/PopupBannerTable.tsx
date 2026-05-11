'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import { IPopupBanner } from '@/services/popup-banner/popup-banner';
import PopupBannerColumn from './PopupBannerColumn';

const PopupBannerTable = ({ banners }: { banners: IPopupBanner[] }) => {
  return (
    <TableManageMent
      columns={PopupBannerColumn}
      data={banners || []}
      getRowKey={(b) => b._id as string}
      emptyMessage="No popup banner found"
    />
  );
};

export default PopupBannerTable;

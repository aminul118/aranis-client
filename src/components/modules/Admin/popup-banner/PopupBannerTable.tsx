'use client';

import TableFilters from '@/components/common/table/TableFilters';
import TableManageMent from '@/components/common/table/TableManageMent';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IPopupBanner } from '@/services/popup-banner/popup-banner';
import { IMeta } from '@/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { getPopupBannerColumns } from './PopupBannerColumn';
import PopupBannerForm from './PopupBannerForm';

interface Props {
  banners: IPopupBanner[];
  meta?: IMeta;
}

const PopupBannerTable = ({ banners, meta }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<
    IPopupBanner | undefined
  >(undefined);

  const handleOpen = (banner?: IPopupBanner) => {
    setSelectedBanner(banner);
    setIsOpen(true);
  };

  const columns = getPopupBannerColumns(handleOpen);

  return (
    <ClientTableWrapper
      tableTitle="Popup Banners"
      meta={meta}
      action={
        <Button
          onClick={() => handleOpen()}
          className="rounded-full bg-blue-600 px-8 font-black text-white hover:bg-blue-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New
        </Button>
      }
    >
      <TableFilters />
      <TableManageMent
        columns={columns}
        data={banners || []}
        getRowKey={(b) => b._id as string}
        emptyMessage="No popup banner found"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedBanner ? 'Edit Popup Banner' : 'Add New Popup Banner'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <PopupBannerForm
              banner={selectedBanner}
              onSuccess={() => setIsOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </ClientTableWrapper>
  );
};

export default PopupBannerTable;

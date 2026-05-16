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
import { IOffer } from '@/services/offer/offer';
import { IMeta } from '@/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { getOfferColumns } from './OfferColumn';
import OfferForm from './OfferForm';

interface Props {
  offers: IOffer[];
  meta?: IMeta;
}

const OfferTable = ({ offers, meta }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<IOffer | undefined>(
    undefined,
  );

  const handleOpen = (offer?: IOffer) => {
    setSelectedOffer(offer);
    setIsOpen(true);
  };

  const columns = getOfferColumns(handleOpen);

  return (
    <ClientTableWrapper
      tableTitle="Offer Management"
      meta={meta}
      action={
        <Button
          onClick={() => handleOpen()}
          className="rounded-full bg-blue-600 px-8 font-black text-white hover:bg-blue-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Offer
        </Button>
      }
    >
      <TableFilters />
      <TableManageMent
        columns={columns}
        data={offers || []}
        getRowKey={(o) => o._id as string}
        emptyMessage="No offers found"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="overflow-hidden rounded-[32px] border-none bg-white/95 p-0 shadow-2xl backdrop-blur-xl sm:max-w-[600px] dark:bg-zinc-950/95">
          <div className="bg-blue-600 p-8 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight uppercase">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <Plus size={20} />
                </div>
                {selectedOffer ? 'Edit Offer' : 'Create New Offer'}
              </DialogTitle>
            </DialogHeader>
            <p className="mt-2 text-xs font-medium text-blue-100/80">
              {selectedOffer
                ? 'Update promotional details for this tag.'
                : 'Define a new promotional tag with custom discounts and dates.'}
            </p>
          </div>
          <div className="p-8">
            <OfferForm
              offer={selectedOffer}
              onSuccess={() => setIsOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </ClientTableWrapper>
  );
};

export default OfferTable;

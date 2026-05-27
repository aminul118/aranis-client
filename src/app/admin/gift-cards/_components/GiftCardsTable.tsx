'use client';

import DeleteConfirmation from '@/components/common/actions/DeleteConfirmation';
import TableFilters from '@/components/common/table/TableFilters';
import TableManageMent from '@/components/common/table/TableManageMent';
import { Button } from '@/components/ui/button';
import { IGiftCard, deleteGiftCardBulk } from '@/services/giftcard/giftcard';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import GiftCardsColumn from './GiftCardsColumn';

const GiftCardsTable = ({ giftCards }: { giftCards: IGiftCard[] }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="animate-in slide-in-from-top-4 flex items-center justify-between rounded-xl bg-blue-600 p-4 text-white shadow-xl duration-300">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <span className="font-black">{selectedIds.length}</span>
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase">
                Gift Cards Selected
              </p>
              <p className="text-xs font-medium text-blue-100">
                Select an action to apply to all selected items
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <DeleteConfirmation
              onConfirm={() => deleteGiftCardBulk(selectedIds)}
              onSuccess={() => setSelectedIds([])}
              title="Delete Selected Gift Cards?"
              description={`Are you sure you want to delete ${selectedIds.length} gift cards? This action cannot be undone.`}
            >
              <Button className="rounded-xl border-none bg-red-500 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-red-500/20 hover:bg-red-600">
                <Trash2 size={14} className="mr-2" /> Delete Selected
              </Button>
            </DeleteConfirmation>

            <Button
              variant="ghost"
              onClick={() => setSelectedIds([])}
              className="rounded-xl text-[10px] font-bold tracking-widest text-white uppercase hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <TableFilters />
      <TableManageMent
        columns={GiftCardsColumn}
        data={giftCards || []}
        getRowKey={(g) => g._id as string}
        emptyMessage="No gift cards found"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </div>
  );
};

export default GiftCardsTable;

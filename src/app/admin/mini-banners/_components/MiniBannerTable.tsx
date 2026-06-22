'use client';

import DeleteConfirmation from '@/components/common/actions/DeleteConfirmation';
import TableFilters from '@/components/common/table/TableFilters';
import TableManageMent from '@/components/common/table/TableManageMent';
import { Button } from '@/components/ui/button';
import { deleteMiniBannerBulk } from '@/services/banners/mini-banner/mini-banner';
import type { IMiniBanner } from '@/services/banners/mini-banner/mini-banner.interface';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import MiniBannerColumn from './MiniBannerColumn';

const MiniBannerTable = ({ banners }: { banners: IMiniBanner[] }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="animate-in slide-in-from-top-4 flex items-center justify-between rounded-xl bg-blue-600 p-4 text-white shadow-xl duration-300">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <span className="font-black">{selectedIds.length}</span>
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase">
                Banners Selected
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <DeleteConfirmation
              onConfirm={() => deleteMiniBannerBulk(selectedIds)}
              onSuccess={() => setSelectedIds([])}
              title="Delete Selected Banners?"
              description={`Are you sure you want to delete ${selectedIds.length} banners? This action cannot be undone.`}
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
      <TableFilters hideSearch={true} />
      <TableManageMent
        columns={MiniBannerColumn}
        data={banners || []}
        getRowKey={(b) => b._id as string}
        emptyMessage="No mini banner found"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </div>
  );
};

export default MiniBannerTable;

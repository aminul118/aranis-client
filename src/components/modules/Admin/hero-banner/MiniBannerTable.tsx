'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import { Button } from '@/components/ui/button';
import {
  deleteMiniBannerBulk,
  IMiniBanner,
} from '@/services/hero-banner/hero-banner';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
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
            <Button
              onClick={async () => {
                if (
                  confirm(
                    `Are you sure you want to delete ${selectedIds.length} banners?`,
                  )
                ) {
                  try {
                    const res = await deleteMiniBannerBulk(selectedIds);
                    if (res.success) {
                      toast.success('Banners deleted successfully');
                      setSelectedIds([]);
                    }
                  } catch (error) {
                    toast.error('Failed to delete banners');
                  }
                }
              }}
              className="rounded-xl bg-red-500 text-[10px] font-black tracking-widest text-white uppercase hover:bg-red-600"
            >
              <Trash2 size={14} className="mr-2" /> Delete Selected
            </Button>
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

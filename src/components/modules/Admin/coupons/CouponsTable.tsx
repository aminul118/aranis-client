'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import { Button } from '@/components/ui/button';
import { deleteCouponBulk, ICoupon } from '@/services/coupon/coupon';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import CouponColumns from './CouponColumns';

const CouponsTable = ({ coupons }: { coupons: ICoupon[] }) => {
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
                Coupons Selected
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                if (
                  confirm(
                    `Are you sure you want to delete ${selectedIds.length} coupons?`,
                  )
                ) {
                  try {
                    const res = await deleteCouponBulk(selectedIds);
                    if (res.success) {
                      toast.success('Coupons deleted successfully');
                      setSelectedIds([]);
                    }
                  } catch (error) {
                    toast.error('Failed to delete coupons');
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
        columns={CouponColumns}
        data={coupons || []}
        getRowKey={(c) => c._id as string}
        emptyMessage="No coupons found"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </div>
  );
};

export default CouponsTable;

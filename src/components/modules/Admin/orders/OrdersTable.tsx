'use client';

import DeleteConfirmation from '@/components/common/actions/DeleteConfirmation';
import TableFilters from '@/components/common/table/TableFilters';
import TableManageMent from '@/components/common/table/TableManageMent';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { deleteOrderBulk, IOrder } from '@/services/order/order';
import { Role } from '@/types';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import OrdersColumn from './OrdersColumn';

const OrdersTable = ({ orders }: { orders: IOrder[] }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { user } = useUser();
  const isSuperAdmin = user?.role === Role.SUPER_ADMIN;

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && isSuperAdmin && (
        <div className="animate-in slide-in-from-top-4 flex items-center justify-between rounded-xl bg-blue-600 p-4 text-white shadow-xl duration-300">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <span className="font-black">{selectedIds.length}</span>
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase">
                Orders Selected
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <DeleteConfirmation
              onConfirm={() => deleteOrderBulk(selectedIds)}
              onSuccess={() => setSelectedIds([])}
              title="Delete Selected Orders?"
              description={`Are you sure you want to delete ${selectedIds.length} orders? This action cannot be undone.`}
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
        columns={OrdersColumn}
        data={orders || []}
        getRowKey={(o) => o._id as string}
        emptyMessage="No order found"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </div>
  );
};

export default OrdersTable;

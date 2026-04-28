'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import { Button } from '@/components/ui/button';
import { IProduct } from '@/services/product/product';
import { Percent } from 'lucide-react';
import { useState } from 'react';
import BulkDiscountDialog from './BulkDiscountDialog';
import ProductsColumn from './ProductsColumn';

const ProductsTable = ({ products }: { products: IProduct[] }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

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
                Products Selected
              </p>
              <p className="text-xs font-medium text-blue-100">
                Select an action to apply to all selected items
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsBulkDialogOpen(true)}
              className="rounded-xl bg-white text-[10px] font-black tracking-widest text-blue-600 uppercase hover:bg-blue-50"
            >
              <Percent size={14} className="mr-2" /> Apply Bulk Discount
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
        columns={ProductsColumn}
        data={products || []}
        getRowKey={(p) => p._id as string}
        emptyMessage="No product found"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <BulkDiscountDialog
        isOpen={isBulkDialogOpen}
        onClose={() => setIsBulkDialogOpen(false)}
        selectedIds={selectedIds}
        onSuccess={() => setSelectedIds([])}
      />
    </div>
  );
};

export default ProductsTable;

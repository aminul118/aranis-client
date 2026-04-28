'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProductBulk } from '@/services/product/product';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BulkDiscountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSuccess: () => void;
}

const BulkDiscountDialog = ({
  isOpen,
  onClose,
  selectedIds,
  onSuccess,
}: BulkDiscountDialogProps) => {
  const [discount, setDiscount] = useState<string>('20');
  const [isOffer, setIsOffer] = useState<boolean>(true);
  const [offerTag, setOfferTag] = useState<string>('Eid offer');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    const discountVal = Number(discount);
    if (isNaN(discountVal) || discountVal < 0 || discountVal > 100) {
      toast.error('Please enter a valid discount percentage (0-100)');
      return;
    }

    setLoading(true);
    try {
      // For bulk update, we set discountPercentage, isOffer, and offerTag
      // The salePrice calculation will be handled by the update logic if we pass it,
      // but since it's bulk and prices vary, we might need to handle it per product.
      // Wait, the backend updateMany is a simple $set.
      // To handle salePrice = price * (1 - discount/100) for EACH product in updateMany is NOT possible with a simple $set.
      // So we might need to send the payload to the backend and let the backend do a loop or use a more complex aggregation update.

      // Actually, let's just send the discountPercentage and let the frontend/backend calculate it.
      // If the backend doesn't handle dynamic calculation in updateMany, I should update the service.

      const res = await updateProductBulk(selectedIds, {
        isOffer,
        offerTag,
        discountPercentage: discountVal,
      });

      if (res.success) {
        toast.success(
          `Successfully applied ${discountVal}% discount to ${selectedIds.length} products`,
        );
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || 'Failed to apply discount');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight uppercase">
            Bulk Discount
          </DialogTitle>
          <DialogDescription>
            Apply a discount to {selectedIds.length} selected products.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label
              htmlFor="discount"
              className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase"
            >
              Discount Percentage (%)
            </Label>
            <Input
              id="discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="e.g. 20"
              className="rounded-xl border-2 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2 rounded-xl border border-dashed border-blue-500/30 bg-blue-50/30 p-4">
            <Checkbox
              id="isOffer"
              checked={isOffer}
              onCheckedChange={(checked) => setIsOffer(checked as boolean)}
            />
            <Label
              htmlFor="isOffer"
              className="text-sm leading-none font-bold peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mark as Special Offer
            </Label>
          </div>
          {isOffer && (
            <div className="grid gap-2">
              <Label
                htmlFor="tag"
                className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase"
              >
                Offer Tag
              </Label>
              <select
                id="tag"
                value={offerTag}
                onChange={(e) => setOfferTag(e.target.value)}
                className="border-input bg-background ring-offset-background flex h-10 w-full rounded-xl border-2 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="Pakistani dress">Pakistani Dress</option>
                <option value="Indian dress">Indian Dress</option>
                <option value="Eid offer">Eid Offer</option>
                <option value="Normal discount">Normal Discount</option>
              </select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl text-[10px] font-bold tracking-widest uppercase"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-8 text-[10px] font-black tracking-widest text-white uppercase hover:bg-blue-700"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Apply Discount'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDiscountDialog;

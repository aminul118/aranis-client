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
import { createOffer, getOffers, IOffer } from '@/services/offer/offer';
import { updateProductBulk } from '@/services/product/product';
import { Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  const [existingOffers, setExistingOffers] = useState<IOffer[]>([]);
  const [selectedOfferTag, setSelectedOfferTag] = useState<string>('');
  const [isCreatingNewOffer, setIsCreatingNewOffer] = useState(false);

  // New Offer Fields
  const [newOfferName, setNewOfferName] = useState('');
  const [newOfferTag, setNewOfferTag] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expireTime, setExpireTime] = useState('22:00'); // 10 PM default

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchOffers = async () => {
        const res = await getOffers();
        if (res.success) {
          setExistingOffers(res.data);
          if (res.data.length > 0) {
            setSelectedOfferTag(res.data[0].tag);
          }
        }
      };
      fetchOffers();
    }
  }, [isOpen]);

  const handleApply = async () => {
    const discountVal = Number(discount);
    if (isNaN(discountVal) || discountVal < 0 || discountVal > 100) {
      toast.error('Please enter a valid discount percentage (0-100)');
      return;
    }

    setLoading(true);
    try {
      let finalTag = selectedOfferTag;

      if (isOffer && isCreatingNewOffer) {
        // Create new offer first
        if (!newOfferName || !newOfferTag || !startDate || !endDate) {
          toast.error('Please fill all offer details');
          setLoading(false);
          return;
        }

        const startDateTime = new Date(startDate);
        const endDateTime = new Date(`${endDate}T${expireTime}`);

        const offerRes = await createOffer({
          name: newOfferName,
          tag: newOfferTag,
          discountPercentage: discountVal,
          startDate: startDateTime,
          endDate: endDateTime,
        });

        if (!offerRes.success) {
          toast.error(offerRes.message || 'Failed to create offer');
          setLoading(false);
          return;
        }
        finalTag = newOfferTag;
      }

      const res = await updateProductBulk(selectedIds, {
        isOffer: isOffer,
        offerTag: isOffer ? finalTag : '',
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight uppercase">
            Bulk Discount
          </DialogTitle>
          <DialogDescription>
            Apply a discount to {selectedIds.length} selected products.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold tracking-widest text-blue-700 uppercase">
                Discount Percentage (%)
              </Label>
              <Input
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
              <Label htmlFor="isOffer" className="text-sm font-bold">
                Apply as Seasonal Offer (Shows on Offers Page)
              </Label>
            </div>

            {isOffer && (
              <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold tracking-widest text-blue-700 uppercase">
                    Select Offer Tag
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreatingNewOffer(!isCreatingNewOffer)}
                    className="text-[10px] font-bold text-blue-600 uppercase"
                  >
                    {isCreatingNewOffer ? (
                      'Select Existing'
                    ) : (
                      <>
                        <Plus size={12} className="mr-1" /> Create New
                      </>
                    )}
                  </Button>
                </div>

                {!isCreatingNewOffer ? (
                  <select
                    value={selectedOfferTag}
                    onChange={(e) => setSelectedOfferTag(e.target.value)}
                    className="border-input bg-background flex h-10 w-full rounded-xl border-2 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select an offer</option>
                    {existingOffers.map((o) => (
                      <option key={o._id} value={o.tag}>
                        {o.name} ({o.tag})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-gray-700 uppercase">
                          Offer Name
                        </Label>
                        <Input
                          placeholder="e.g. Eid Dhamaka"
                          value={newOfferName}
                          onChange={(e) => setNewOfferName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-gray-700 uppercase">
                          Tag Identifier
                        </Label>
                        <Input
                          placeholder="e.g. eid-2024"
                          value={newOfferTag}
                          onChange={(e) => setNewOfferTag(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-gray-700 uppercase">
                          Start Date
                        </Label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-gray-700 uppercase">
                          End Date
                        </Label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-gray-700 uppercase">
                        Expiration Time (24h)
                      </Label>
                      <Input
                        type="time"
                        value={expireTime}
                        onChange={(e) => setExpireTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t pt-4 dark:border-white/5">
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
            className="rounded-xl bg-blue-600 px-8 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/20 hover:bg-blue-700"
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

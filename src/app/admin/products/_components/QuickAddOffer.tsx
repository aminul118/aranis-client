'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createOffer, IOffer } from '@/services/offer/offer';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface QuickAddOfferProps {
  onSuccess: (newOffer: IOffer) => void;
}

export default function QuickAddOffer({ onSuccess }: QuickAddOfferProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    discountPercentage: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.tag) {
      return toast.error('Name and Tag are required');
    }

    setLoading(true);
    try {
      // Default dates: Now to 1 month later
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const res = await createOffer({
        ...formData,
        startDate,
        endDate,
        isActive: true,
      });

      if (res.success) {
        toast.success('Offer tag added successfully');
        onSuccess(res.data as IOffer);
        setOpen(false);
        setFormData({ name: '', tag: '', discountPercentage: 0 });
      } else {
        toast.error(res.message || 'Failed to add offer tag');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg border-dashed text-[10px] font-black uppercase"
        >
          <Plus className="mr-1 h-3 w-3" /> New Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden rounded-[32px] border-none bg-white/95 p-0 shadow-2xl backdrop-blur-xl sm:max-w-[425px] dark:bg-zinc-950/95">
        <div className="bg-blue-600 p-8 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight uppercase">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <Plus size={20} />
              </div>
              Quick Add Offer
            </DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-xs font-medium text-blue-100/80">
            Create a new promotional tag for your products instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold tracking-widest text-blue-700 uppercase">
                Offer Name
              </Label>
              <div className="relative">
                <Input
                  placeholder="e.g. Eid-ul-Fitr 2026"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="rounded-xl border-2 pl-4 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold tracking-widest text-blue-700 uppercase">
                Tag Identifier (ID)
              </Label>
              <Input
                placeholder="e.g. eid-26"
                value={formData.tag}
                onChange={(e) =>
                  setFormData({ ...formData, tag: e.target.value })
                }
                className="rounded-xl border-2 font-mono focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold tracking-widest text-blue-700 uppercase">
                Discount Percentage (%)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="e.g. 15"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPercentage: Number(e.target.value),
                    })
                  }
                  className="rounded-xl border-2 pr-10 focus:border-blue-500"
                />
                <span className="absolute top-1/2 right-4 -translate-y-1/2 font-bold text-gray-400">
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
            <p className="text-muted-foreground text-[10px] leading-relaxed font-medium italic">
              * This tag will be active for 1 month by default. You can adjust
              dates in the full Offers management section.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-blue-600 text-sm font-black tracking-widest text-white uppercase shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-95"
          >
            {loading ? 'Adding...' : 'Create Offer Tag'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { createSize } from '@/services/size/size';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface QuickAddSizeProps {
  onSuccess: (newSize: any) => void;
}

export default function QuickAddSize({ onSuccess }: QuickAddSizeProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [order, setOrder] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toast.error('Size name is required');

    setLoading(true);
    try {
      const res = await createSize({ name, order });
      if (res.success) {
        toast.success('Size added successfully');
        onSuccess(res.data);
        setOpen(false);
        setName('');
        setOrder(0);
      } else {
        toast.error(res.message || 'Failed to add size');
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
          <Plus className="mr-1 h-3 w-3" /> New Size
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Add Size</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Size Name</Label>
            <Input
              placeholder="e.g. Royal Blue"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Serial Order (optional)</Label>
            <Input
              type="number"
              placeholder="e.g. 1"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Size'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

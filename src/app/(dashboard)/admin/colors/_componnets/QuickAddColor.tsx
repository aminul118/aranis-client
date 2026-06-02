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
import { createColor } from '@/services/color/color';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface QuickAddColorProps {
  onSuccess: (newColor: any) => void;
}

export default function QuickAddColor({ onSuccess }: QuickAddColorProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#000000');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toast.error('Color name is required');

    setLoading(true);
    try {
      const res = await createColor({ name, hex });
      if (res.success) {
        toast.success('Color added successfully');
        onSuccess(res.data);
        setOpen(false);
        setName('');
        setHex('#000000');
      } else {
        toast.error(res.message || 'Failed to add color');
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
          <Plus className="mr-1 h-3 w-3" /> New Color
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Add Color</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Color Name</Label>
            <Input
              placeholder="e.g. Royal Blue"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Hex Code</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                className="h-10 w-20 p-1"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
              />
              <Input
                placeholder="#000000"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Color'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

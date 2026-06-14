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
import { createCategory } from '@/services/category/category';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface QuickAddCategoryProps {
  onSuccess: (newCategory: any) => void;
}

export default function QuickAddCategory({ onSuccess }: QuickAddCategoryProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toast.error('Category name is required');

    setLoading(true);
    try {
      const res = await createCategory({
        name,
        subCategories: [],
        colors: [],
        sizes: [],
      } as any);

      if (res.success) {
        toast.success('Category added successfully');
        onSuccess(res.data);
        setOpen(false);
        setName('');
      } else {
        toast.error(res.message || 'Failed to add category');
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
          <Plus className="mr-1 h-3 w-3" /> New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Add Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input
              placeholder="e.g. Traditional Wear"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <p className="text-muted-foreground text-[10px] italic">
            * You can add subcategories and sizes later from the Categories
            management page.
          </p>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Category'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

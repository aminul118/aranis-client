'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { ISize } from '@/services/size/size.interface';
import { Plus } from 'lucide-react';
import { ReactNode, useState } from 'react';
import SizeForm from './SizeForm';

interface Props {
  size?: ISize;
  trigger?: ReactNode;
}

const SizeModal = ({ size, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const isEdit = !!size;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Size
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Update Size' : 'Add New Size'}</DialogTitle>
        </DialogHeader>
        <SizeForm size={size} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default SizeModal;

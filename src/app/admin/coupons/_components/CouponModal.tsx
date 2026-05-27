'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ICoupon } from '@/services/coupon/coupon';
import { Plus, TicketPercent } from 'lucide-react';
import { ReactNode, useState } from 'react';
import CouponForm from './CouponForm';

interface Props {
  coupon?: ICoupon;
  trigger?: ReactNode;
}

const CouponModal = ({ coupon, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const isEdit = !!coupon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="rounded-full bg-blue-600 font-bold hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Coupon
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <TicketPercent className="h-5 w-5 text-blue-500" />
            </div>
            <DialogTitle>
              {isEdit ? 'Update Coupon' : 'Add New Coupon'}
            </DialogTitle>
          </div>
        </DialogHeader>
        <CouponForm coupon={coupon} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default CouponModal;

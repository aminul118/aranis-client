'use client';

import DeleteFromTableDropDown from '@/components/common/actions/DeleteFromTableDropDown';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteCoupon, ICoupon } from '@/services/coupon/coupon';
import { EllipsisIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import CouponModal from './CouponModal';

const CouponActions = ({ coupon }: { coupon: ICoupon }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async (id: string) => {
    const res = await deleteCoupon(id);
    return res;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shadow-none hover:bg-white/5"
              aria-label="Actions"
            >
              <EllipsisIcon
                size={16}
                aria-hidden="true"
                className="text-muted-foreground"
              />
            </Button>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-card border-border min-w-48"
        >
          <CouponModal
            coupon={coupon}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex cursor-pointer items-center"
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            }
          />

          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteFromTableDropDown
        onConfirm={() => handleDelete(coupon._id as string)}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
    </>
  );
};

export default CouponActions;

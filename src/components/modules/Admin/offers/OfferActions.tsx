'use client';

import DeleteFromTableDropDown from '@/components/common/actions/DeleteFromTableDropDown';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { applyOfferToAll, deleteOffer, IOffer } from '@/services/offer/offer';
import { EllipsisIcon, GlobeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  offer: IOffer;
  onEdit?: (offer: IOffer) => void;
}

const OfferActions = ({ offer, onEdit }: Props) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [globalApplyOpen, setGlobalApplyOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    return await deleteOffer(id);
  };

  const handleGlobalApply = async () => {
    setLoading(true);
    try {
      const res = await applyOfferToAll(offer.tag);
      if (res.success) {
        toast.success(res.message || 'Offer applied to all products');
        setGlobalApplyOpen(false);
      } else {
        toast.error(res.message || 'Failed to apply offer globally');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none"
              aria-label="Actions"
            >
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            onClick={() => onEdit?.(offer)}
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-blue-600 focus:text-blue-700"
            onClick={() => setGlobalApplyOpen(true)}
          >
            <GlobeIcon className="mr-2 h-4 w-4" />
            <span>Apply to All Products</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
        onConfirm={() => handleDelete(offer._id as string)}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />

      <AlertDialog open={globalApplyOpen} onOpenChange={setGlobalApplyOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply Offer to ALL Products?</AlertDialogTitle>
            <AlertDialogDescription>
              This will update the price and offer tag for **EVERY** product on
              your website to use the "{offer.name}" discount (
              {offer.discountPercentage}%). This action can be undone by
              applying a different offer or removing it individually.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleGlobalApply();
              }}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Applying...' : 'Yes, Apply to All'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OfferActions;

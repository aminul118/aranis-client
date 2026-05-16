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
import { deleteSizeGuide } from '@/services/size-guide/size-guide';
import { ISizeGuide } from '@/types';
import { EllipsisIcon, EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

interface Props {
  sizeGuide: ISizeGuide;
  onEdit: (sg: ISizeGuide) => void;
  onView: () => void;
}

const SizeGuideActions = ({ sizeGuide, onEdit, onView }: Props) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async (id: string) => {
    return await deleteSizeGuide(id);
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
            onClick={onView}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            <span>View Image</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            onClick={() => onEdit(sizeGuide)}
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            <span>Edit</span>
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
        onConfirm={() => handleDelete(sizeGuide._id as string)}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
    </>
  );
};

export default SizeGuideActions;

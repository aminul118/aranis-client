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
import { deleteSize, ISize } from '@/services/size/size';
import { EllipsisIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import SizeModal from './SizeModal';

const SizeActions = ({ size }: { size: ISize }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async (id: string) => {
    const res = await deleteSize(id);
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
              className="shadow-none"
              aria-label="Actions"
            >
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="min-w-48">
          <SizeModal
            size={size}
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
        onConfirm={() => handleDelete(size._id as string)}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
    </>
  );
};

export default SizeActions;

'use client';

import DeleteFromTableDropDown from '@/components/common/actions/DeleteFromTableDropDown';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteProduct } from '@/services/product/product';
import { IProduct } from '@/types';
import { EllipsisIcon, EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const ProductActions = ({ product }: { product: IProduct }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async (id: string) => {
    const res = await deleteProduct(id);
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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* View Details */}
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/products/${product._id}`}
              className="flex cursor-pointer items-center"
            >
              <EyeIcon className="mr-2 h-4 w-4" />
              <span>View Details</span>
            </Link>
          </DropdownMenuItem>

          {/* Edit */}
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/products/${product._id}/edit`}
              className="flex cursor-pointer items-center"
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete */}
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
        onConfirm={() => handleDelete(product._id as string)}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
    </>
  );
};

export default ProductActions;

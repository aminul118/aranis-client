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
import { deleteProduct, forceDeleteProduct } from '@/services/product/product';
import type { IProduct } from '@/services/product/product.interface';
import {
  EllipsisIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const ProductActions = ({ product }: { product: IProduct }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [forceDeleteOpen, setForceDeleteOpen] = useState(false);

  const handleDelete = async (id: string) => {
    const res = await deleteProduct(id);
    return res;
  };

  const handleForceDelete = async (id: string) => {
    const res = await forceDeleteProduct(id);
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

          {/* Delete (Soft) */}
          {!product.isDeleted && (
            <DropdownMenuItem
              className="cursor-pointer text-orange-600 focus:text-orange-600"
              onClick={() => setDeleteOpen(true)}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              <span>Soft Delete</span>
            </DropdownMenuItem>
          )}

          {/* Force Delete (Hard) */}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer font-bold"
            onClick={() => setForceDeleteOpen(true)}
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            <span>Force Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteFromTableDropDown
        onConfirm={() => handleDelete(product._id as string)}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />

      <DeleteFromTableDropDown
        onConfirm={() => handleForceDelete(product._id as string)}
        open={forceDeleteOpen}
        setOpen={setForceDeleteOpen}
      />
    </>
  );
};

export default ProductActions;

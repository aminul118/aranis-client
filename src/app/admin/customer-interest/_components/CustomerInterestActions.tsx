'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ICustomerInterestItem } from '@/services/customer-interest/customer-interest.interface';
import { Eye, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

const CustomerInterestActions = ({
  product,
}: {
  product: ICustomerInterestItem;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/customer-interest/${product._id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Users
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomerInterestActions;

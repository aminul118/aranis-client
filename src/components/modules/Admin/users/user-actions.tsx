'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IUser } from '@/types/api.types';
import { EllipsisIcon } from 'lucide-react';
import { useState } from 'react';
import { UserDetailsModal } from './UserDetailsModal';

const UserActions = ({ user }: { user: IUser }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none"
              aria-label="Edit item"
            >
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuItem
            onClick={() => {
              setDetailsOpen(true);
            }}
          >
            User Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modals */}

      <UserDetailsModal
        open={detailsOpen}
        setOpen={setDetailsOpen}
        user={user}
      />
    </>
  );
};

export default UserActions;

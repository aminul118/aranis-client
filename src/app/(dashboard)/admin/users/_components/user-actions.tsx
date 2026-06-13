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
import { deleteUserBulk, getMe } from '@/services/user/users';
import { IUser } from '@/types/api.types';
import { EllipsisIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { logger } from '../../../../../lib/logger';
import { UserDetailsModal } from './UserDetailsModal';

const UserActions = ({ user }: { user: IUser }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const res = await getMe();
        if (res.success) {
          setCurrentUser(res.data!);
        }
      } catch (error) {
        logger.error('Failed to fetch current user', error);
      }
    };
    fetchCurrent();
  }, []);

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isSelf = currentUser?._id === user._id;

  const handleDelete = async () => {
    return await deleteUserBulk([user._id]);
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
              aria-label="Edit item"
            >
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setDetailsOpen(true);
            }}
          >
            User Details
          </DropdownMenuItem>
          {isSuperAdmin && !isSelf && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                <span>Delete User</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modals */}

      <UserDetailsModal
        open={detailsOpen}
        setOpen={setDetailsOpen}
        user={user}
      />

      <DeleteFromTableDropDown
        onConfirm={handleDelete}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
    </>
  );
};

export default UserActions;

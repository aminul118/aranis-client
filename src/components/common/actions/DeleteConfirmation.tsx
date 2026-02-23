'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import useActionHandler from '@/hooks/useActionHandler';
import { Trash2 } from 'lucide-react';
import { ReactNode, useState } from 'react';
import Tooltip from '../Tooltip';

interface IDeleteConfirmation {
  onConfirm: () => Promise<any>;
  children?: ReactNode;
}

const DeleteConfirmation = ({ children, onConfirm }: IDeleteConfirmation) => {
  const { executePost, isPending } = useActionHandler();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await executePost({
      action: onConfirm,
      success: {
        loadingText: 'Deleting...',
        message: 'Deleted successfully',
        onSuccess: () => {
          setOpen(false); //  close dialog after success
        },
      },
      errorMessage: 'Failed to delete.',
    });
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (isPending) return; //  block close while pending
        setOpen(value);
      }}
    >
      <Tooltip content="Delete">
        <AlertDialogTrigger asChild>
          {children ?? (
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </AlertDialogTrigger>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete and
            remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault(); //  prevent auto-close
              handleDelete();
            }}
          >
            {isPending ? 'Deleting...' : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmation;

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
  onSuccess?: () => void;
  children?: ReactNode;
  title?: string;
  description?: string;
}

const DeleteConfirmation = ({
  children,
  onConfirm,
  onSuccess,
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone. This will permanently delete and remove your data from our servers.',
}: IDeleteConfirmation) => {
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
          if (onSuccess) onSuccess();
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
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
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

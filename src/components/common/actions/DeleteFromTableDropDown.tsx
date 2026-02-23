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
} from '@/components/ui/alert-dialog';
import useActionHandler from '@/hooks/useActionHandler';
import { ApiResponse, IModal } from '@/types';

interface Props extends IModal {
  onConfirm: () => Promise<ApiResponse<unknown>>;
}

const DeleteFromTableDropDown = ({ open, setOpen, onConfirm }: Props) => {
  const { executePost, isPending } = useActionHandler();

  const handleDelete = async () => {
    await executePost({
      action: onConfirm,
      success: {
        loadingText: 'Deleting...',
        message: 'Deleted successfully',
        onSuccess: () => {
          setOpen(false);
        },
      },
      errorMessage: 'Failed to delete.',
    });
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (isPending) return; //  prevent close while deleting
        setOpen(value);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
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

export default DeleteFromTableDropDown;

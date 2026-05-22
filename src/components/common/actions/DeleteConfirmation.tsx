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
import { AlertTriangle, Trash2 } from 'lucide-react';
import { ReactNode, useState } from 'react';
import Tooltip from '../Tooltip';

interface IDeleteConfirmation {
  onConfirm: () => Promise<any>;
  onSuccess?: () => void;
  children?: ReactNode;
  title?: string;
  description?: string;
  /** Optional count shown in the summary row (e.g. selected items) */
  count?: number;
}

const DeleteConfirmation = ({
  children,
  onConfirm,
  onSuccess,
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone. This will permanently delete and remove your data from our servers.',
  count,
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
          setOpen(false);
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
        if (isPending) return;
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

      <AlertDialogContent className="border-border bg-card max-w-md overflow-hidden rounded-2xl p-0 shadow-2xl">
        {/* Header */}
        <AlertDialogHeader className="items-center gap-3 px-6 pt-8 pb-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <AlertDialogTitle className="text-center text-xl font-black">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-center text-sm leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Count summary (only shown when count prop provided) */}
        {count !== undefined && (
          <div className="border-border bg-muted/40 mx-6 rounded-xl border px-4 py-3 text-sm">
            <p className="text-muted-foreground mb-1 text-[10px] font-black tracking-widest uppercase">
              Items to delete
            </p>
            <p className="text-foreground font-bold">
              {count} item{count !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        <AlertDialogFooter className="flex gap-3 px-6 pb-6 sm:flex-row">
          <AlertDialogCancel
            disabled={isPending}
            className="border-border flex-1 rounded-xl font-bold"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            className="flex-1 rounded-xl bg-red-500 font-black text-white hover:bg-red-600 disabled:opacity-60 dark:bg-red-500 dark:hover:bg-red-600"
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Deleting…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Trash2 size={15} />
                Yes, Delete
              </span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmation;

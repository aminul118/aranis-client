/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import SubmitButton from '@/components/common/button/submit-button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Password from '@/components/ui/password';
import useActionHandler from '@/hooks/useActionHandler';
import { changePassword } from '@/services/user/users';
import { setPasswordSchema, SetPasswordValues } from '@/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface SetPasswordModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SetPasswordModal = ({ open, setOpen }: SetPasswordModalProps) => {
  const { executePost } = useActionHandler();

  const form = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SetPasswordValues) => {
    await executePost({
      action: () => changePassword(data),
      success: {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
        loadingText: 'Setting your password...',
        message:
          'Password set successfully! You can now login with your password.',
      },
      errorMessage: 'Failed to set password',
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <KeyRound className="text-primary h-5 w-5" />
            Set Account Password
          </AlertDialogTitle>
          <AlertDialogDescription>
            Setting a password allows you to login more securely without waiting
            for an OTP every time.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Password placeholder="Enter new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Password placeholder="Confirm new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter className="pt-4">
              <AlertDialogCancel asChild>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </AlertDialogCancel>
              <SubmitButton
                loading={form.formState.isSubmitting}
                text="Set Password"
                icon={<KeyRound className="mr-2 h-4 w-4" />}
                loadingText="Setting..."
              />
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SetPasswordModal;

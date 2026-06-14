'use client';

import SubmitButton from '@/components/common/button/submit-button';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useActionHandler from '@/hooks/useActionHandler';
import { changePassword } from '@/services/auth/change-password';
import { changePasswordSchema, ChangePasswordValues } from '@/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const ChangePasswordClient = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { executePost } = useActionHandler();

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    await executePost({
      action: () =>
        changePassword({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      success: {
        onSuccess: () => {
          form.reset();
        },
        message: 'Password changed successfully',
        loadingText: 'Changing password...',
      },
      errorMessage: 'Failed to change password.',
    });
  };

  return (
    <section className="flex flex-1 items-center justify-center py-8">
      <div className="group relative w-full max-w-3xl overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm sm:p-10 dark:border-blue-900/30 dark:from-blue-950/20 dark:to-[#0a0a0a]">
        {/* Decorative dots (cutouts) */}
        <div className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full border border-blue-100 bg-white dark:border-blue-900/30 dark:bg-[#0a0a0a]" />
        <div className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full border border-blue-100 bg-white dark:border-blue-900/30 dark:bg-[#0a0a0a]" />

        <div className="mb-6 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Change Password
              </h3>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                <KeyRound className="h-3.5 w-3.5" />
                <span>Update your password to keep your account secure</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-6 dark:border-blue-800/50 dark:bg-blue-900/10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showOldPassword ? 'text' : 'password'}
                          placeholder="Enter your current password"
                          className="border-blue-100 bg-white focus-visible:ring-blue-500 dark:border-blue-900/30 dark:bg-[#0a0a0a]"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 h-full px-3 py-2 text-gray-500 hover:bg-transparent hover:text-blue-600 dark:text-gray-400"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                          {showOldPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Enter your new password"
                          className="border-blue-100 bg-white focus-visible:ring-blue-500 dark:border-blue-900/30 dark:bg-[#0a0a0a]"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 h-full px-3 py-2 text-gray-500 hover:bg-transparent hover:text-blue-600 dark:text-gray-400"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Must be at least 8 characters with uppercase, lowercase,
                      and numbers
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your new password"
                          className="border-blue-100 bg-white focus-visible:ring-blue-500 dark:border-blue-900/30 dark:bg-[#0a0a0a]"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 h-full px-3 py-2 text-gray-500 hover:bg-transparent hover:text-blue-600 dark:text-gray-400"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-6 font-bold"
                  onClick={() => form.reset()}
                >
                  Cancel
                </Button>
                <div className="[&>button]:rounded-full [&>button]:bg-blue-600 [&>button]:px-8 [&>button]:font-bold [&>button]:text-white hover:[&>button]:bg-blue-700">
                  <SubmitButton />
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default ChangePasswordClient;

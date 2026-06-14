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
import { Eye, EyeOff } from 'lucide-react';
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

  const watchedNewPassword = form.watch('newPassword');

  const requirements = [
    {
      id: 'length',
      text: 'At least 8 characters',
      met: watchedNewPassword.length >= 8,
    },
    {
      id: 'upper',
      text: 'One uppercase letter',
      met: /[A-Z]/.test(watchedNewPassword),
    },
    {
      id: 'lower',
      text: 'One lowercase letter',
      met: /[a-z]/.test(watchedNewPassword),
    },
    {
      id: 'number',
      text: 'One number',
      met: /[0-9]/.test(watchedNewPassword),
    },
  ];

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
    <div className="w-full">
      <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-6 sm:p-8 dark:border-blue-800/50 dark:bg-blue-900/10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold tracking-widest text-gray-900 uppercase dark:text-white">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showOldPassword ? 'text' : 'password'}
                        placeholder="Enter your current password"
                        className="h-12 rounded-xl border-blue-100 bg-white px-4 text-base focus-visible:ring-blue-500 dark:border-blue-900/30 dark:bg-[#0a0a0a]"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-1 right-2 h-10 px-3 py-2 text-gray-400 hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold tracking-widest text-gray-900 uppercase dark:text-white">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Enter your new password"
                            className="h-12 rounded-xl border-blue-100 bg-white px-4 text-base focus-visible:ring-blue-500 dark:border-blue-900/30 dark:bg-[#0a0a0a]"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-1 right-2 h-10 px-3 py-2 text-gray-400 hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold tracking-widest text-gray-900 uppercase dark:text-white">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your new password"
                            className="h-12 rounded-xl border-blue-100 bg-white px-4 text-base focus-visible:ring-blue-500 dark:border-blue-900/30 dark:bg-[#0a0a0a]"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-1 right-2 h-10 px-3 py-2 text-gray-400 hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Requirements UI */}
              <div className="flex flex-col justify-center rounded-xl bg-white/50 p-5 dark:bg-black/20">
                <h4 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">
                  Password Requirements
                </h4>
                <div className="space-y-3">
                  {requirements.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                          req.met
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                            : 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span
                        className={`transition-colors ${
                          req.met
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
  );
};

export default ChangePasswordClient;

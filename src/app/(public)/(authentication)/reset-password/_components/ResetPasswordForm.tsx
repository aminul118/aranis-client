'use client';

import SubmitButton from '@/components/common/button/submit-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { resetPassword } from '@/services/auth/password-reset';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AlertPopUp from '../../login/_components/AlertPopUp';

const resetPasswordValidation = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type AlertState = {
  type: 'success' | 'error' | 'info';
  title: string;
  description: string;
} | null;

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get('identifier');
  const token = searchParams.get('token');

  const [alert, setAlert] = useState<AlertState>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetPasswordValidation),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordValidation>) => {
    if (!identifier || !token) {
      setAlert({
        type: 'error',
        title: 'Invalid Link',
        description: 'The password reset link is invalid or expired.',
      });
      return;
    }

    setAlert(null);

    try {
      const res = await resetPassword({
        identifier,
        token,
        newPassword: values.password,
      });

      if (res.success) {
        setAlert({
          type: 'success',
          title: 'Success',
          description:
            'Your password has been successfully reset. Redirecting to dashboard...',
        });

        setTimeout(async () => {
          try {
            const { getMe } = await import('@/services/user/users');
            const userRes = await getMe();
            const role = userRes.data?.role;
            if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
              window.location.href = '/admin';
            } else {
              window.location.href = '/user';
            }
          } catch (e) {
            window.location.href = '/login';
          }
        }, 1500);
      } else {
        setAlert({
          type: 'error',
          title: 'Reset Failed',
          description: res.message || 'Unable to reset your password.',
        });
      }
    } catch (error: any) {
      setAlert({
        type: 'error',
        title: 'Something went wrong',
        description:
          error.message || 'Unable to reset password. Please try again later.',
      });
    }
  };

  if (!identifier || !token) {
    return (
      <div className="w-full text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-500">
          Invalid Reset Link
        </h1>
        <p className="text-muted-foreground">
          The link you followed is missing required information. Please request
          a new password reset link.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {alert && (
            <AlertPopUp
              type={alert.type}
              title={alert.title}
              description={alert.description}
              onClose={() => setAlert(null)}
            />
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                  New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock
                      className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                      size={18}
                    />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="focus:border-primary h-12 rounded-xl border-2 pr-10 pl-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
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
                <FormLabel className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock
                      className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                      size={18}
                    />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="focus:border-primary h-12 rounded-xl border-2 pr-10 pl-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton
            loading={form.formState.isSubmitting}
            className="mt-4 h-12 w-full rounded-xl text-sm font-black tracking-widest uppercase"
            text="Reset Password"
            loadingText="Resetting..."
            loadingEffect
          />
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;

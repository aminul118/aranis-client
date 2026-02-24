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
import Password from '@/components/ui/password';
import useSearchParamsValues from '@/hooks/useSearchParamsValues';
import { loginAction } from '@/services/auth/login';
import {
  getDefaultDashboardRoute,
  UserRole,
} from '@/services/user/user-access';
import { loginFormValidation } from '@/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import AlertPopUp from './AlertPopUp';

type FormValues = z.infer<typeof loginFormValidation>;

type AlertState = {
  type: 'success' | 'error' | 'info';
  title: string;
  description: string;
} | null;

const LoginForm = () => {
  const { redirect } = useSearchParamsValues('redirect');
  const router = useRouter();
  const [alert, setAlert] = useState<AlertState>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(loginFormValidation),
    defaultValues: {
      email: 'super@admin.com',
      password: '12345678',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setAlert(null); // reset previous alert

    try {
      const res = await loginAction(values);

      if (res.success) {
        toast.success(res.message);
        router.push(
          redirect || getDefaultDashboardRoute(res.user?.role as UserRole),
        );
      } else {
        setAlert({
          type: 'error',
          title: 'Login failed',
          description:
            res.message || 'Invalid email or password. Please try again.',
        });
      }
    } catch (error: any) {
      setAlert({
        type: 'error',
        title: 'Something went wrong',
        description:
          error.message || 'Unable to login. Please try again later.',
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 py-8"
      >
        {/* Alert */}
        {alert && (
          <AlertPopUp
            type={alert.type}
            title={alert.title}
            description={alert.description}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Password placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton
          loading={form.formState.isSubmitting}
          text="Login"
          loadingText="Logging In"
          loadingEffect
        />

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?
          <Link
            href={`/register${redirect ? `?redirect=${redirect}` : ''}`}
            className="p-0 pl-1 font-medium text-blue-600 hover:underline"
          >
            Create one
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;

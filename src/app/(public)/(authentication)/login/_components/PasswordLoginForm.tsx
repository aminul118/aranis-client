'use client';

import SubmitButton from '@/components/common/button/submit-button';
import IconInput from '@/components/common/form/IconInput';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUser } from '@/context/UserContext';
import useSearchParamsValues from '@/hooks/useSearchParamsValues';
import { loginWithPassword } from '@/services/auth/login';
import { getDefaultDashboardRoute } from '@/services/user/user-access';
import { passwordLoginValidation } from '@/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AlertPopUp from './AlertPopUp';

type AlertState = {
  type: 'success' | 'error' | 'info';
  title: string;
  description: string;
} | null;

const PasswordLoginForm = () => {
  const { redirect } = useSearchParamsValues('redirect');
  const router = useRouter();
  const [alert, setAlert] = useState<AlertState>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { refreshUser } = useUser();
  const form = useForm<any>({
    resolver: zodResolver(passwordLoginValidation),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (values: any) => {
    setAlert(null);

    try {
      const res = await loginWithPassword({
        identifier: values.identifier,
        password: values.password,
      });

      if (res.success) {
        if (res.data?.requiresVerification) {
          const attemptsLeft = res.data.remainingAttempts;
          router.push(
            `/verify?identifier=${encodeURIComponent(values.identifier)}${redirect ? `&redirect=${redirect}` : ''}${attemptsLeft !== undefined ? `&attemptsLeft=${attemptsLeft}` : ''}`,
          );
        } else if (redirect) {
          await refreshUser();
          const path = redirect.startsWith('/') ? redirect : `/${redirect}`;
          window.location.href = path;
        } else {
          await refreshUser();
          const role = res.data?.user?.role;
          window.location.href = getDefaultDashboardRoute(role);
        }
      } else {
        setAlert({
          type: 'error',
          title: 'Login failed',
          description: res.message || 'Invalid credentials.',
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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
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
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                  Email or Phone
                </FormLabel>
                <FormControl>
                  <IconInput
                    icon={Mail}
                    placeholder="Enter your email or phone"
                    className="transition-shadow focus-within:ring-2 focus-within:ring-blue-500/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                    Password
                  </FormLabel>
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-[10px] font-black tracking-widest text-blue-600 uppercase transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Link href="/forgot-password">Forgot Password?</Link>
                  </Button>
                </div>
                <FormControl>
                  <div className="relative">
                    <IconInput
                      icon={Lock}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pr-10 transition-shadow focus-within:ring-2 focus-within:ring-blue-500/20"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton
            loading={form.formState.isSubmitting}
            className="h-12 w-full rounded-full text-sm font-black tracking-widest uppercase shadow-md transition-transform hover:scale-[1.02]"
            text="Login Now"
            loadingText="Logging in..."
            loadingEffect
          />

          <div className="mt-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Button
              variant="link"
              className="px-0 font-bold text-blue-600 dark:text-blue-400"
            >
              <Link
                href={`/register${redirect ? `?redirect=${redirect}` : ''}`}
              >
                Create one
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PasswordLoginForm;

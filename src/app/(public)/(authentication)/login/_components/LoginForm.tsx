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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useSearchParamsValues from '@/hooks/useSearchParamsValues';
import { loginWithPassword } from '@/services/auth/login';
import { requestOTP } from '@/services/auth/otp/sendOTP';
import { loginFormValidation, passwordLoginValidation } from '@/zod/auth';
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

const LoginForm = () => {
  const { redirect } = useSearchParamsValues('redirect');
  const router = useRouter();
  const [alert, setAlert] = useState<AlertState>(null);
  const [loginMode, setLoginMode] = useState<'otp' | 'password'>('otp');
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(
      loginMode === 'otp' ? loginFormValidation : passwordLoginValidation,
    ),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (values: any) => {
    setAlert(null);

    try {
      if (loginMode === 'otp') {
        const res = await requestOTP(values.identifier);
        if (res.success) {
          const attemptsLeft = (res as any).data?.remainingAttempts;
          router.push(
            `/verify?identifier=${encodeURIComponent(values.identifier)}${redirect ? `&redirect=${redirect}` : ''}${attemptsLeft !== undefined ? `&attemptsLeft=${attemptsLeft}` : ''}`,
          );
        } else {
          setAlert({
            type: 'error',
            title: 'OTP Request failed',
            description:
              res.message || 'Unable to request OTP. Please try again.',
          });
        }
      } else {
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
            window.location.href = redirect.startsWith('/')
              ? redirect
              : `/${redirect}`;
          } else {
            // Use user role from login response directly
            const role = res.data?.user?.role;
            if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
              window.location.href = '/admin';
            } else {
              window.location.href = '/user';
            }
          }
        } else {
          setAlert({
            type: 'error',
            title: 'Login failed',
            description: res.message || 'Invalid credentials.',
          });
        }
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
    <div className="space-y-6">
      <Tabs
        value={loginMode}
        onValueChange={(v: any) => setLoginMode(v)}
        className="w-full"
      >
        <TabsList className="flex h-12 w-full overflow-hidden rounded-full bg-[#334155]/60 p-0 shadow-inner dark:bg-slate-800/80">
          <TabsTrigger
            value="otp"
            className="h-full flex-1 rounded-full text-base font-medium text-slate-300 transition-all duration-300 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            OTP
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="h-full flex-1 rounded-full text-base font-medium text-slate-300 transition-all duration-300 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Password
          </TabsTrigger>
        </TabsList>
      </Tabs>

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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {loginMode === 'password' && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <IconInput
                        icon={Lock}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <div className="mt-2 flex justify-end">
                    <Button variant="link" className="px-0">
                      {' '}
                      <Link href="/forgot-password">Forgot Password?</Link>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <SubmitButton
            loading={form.formState.isSubmitting}
            className="h-12 w-full rounded-full text-sm font-black tracking-widest uppercase"
            text={loginMode === 'otp' ? 'Send OTP →' : 'Login Now'}
            loadingText={
              loginMode === 'otp' ? 'Sending OTP...' : 'Logging in...'
            }
            loadingEffect
          />

          <div className="mt-4 text-center text-xs font-medium">
            Don&apos;t have an account?{' '}
            <Button variant="link" className="px-0">
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

export default LoginForm;

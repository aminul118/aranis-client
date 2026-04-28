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
import { toast } from 'sonner';
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
          toast.success('OTP sent to your email/phone');
          router.push(
            `/verify?identifier=${encodeURIComponent(values.identifier)}${redirect ? `&redirect=${redirect}` : ''}`,
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
          toast.success('Logged in successfully');
          window.location.href = redirect ? `/${redirect}` : '/';
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
        <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl p-1">
          <TabsTrigger
            value="otp"
            className="rounded-lg text-xs font-bold tracking-widest uppercase"
          >
            OTP Login
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="rounded-lg text-xs font-bold tracking-widest uppercase"
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
                  <div className="relative">
                    <Mail
                      className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                      size={18}
                    />
                    <Input
                      placeholder="Enter your email or phone"
                      className="h-12 rounded-xl border-2 pl-10 focus:border-blue-500"
                      {...field}
                    />
                  </div>
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
                      <Lock
                        className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                        size={18}
                      />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="h-12 rounded-xl border-2 pr-10 pl-10 focus:border-blue-500"
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
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <SubmitButton
            loading={form.formState.isSubmitting}
            className="h-12 w-full rounded-xl text-sm font-black tracking-widest uppercase shadow-xl shadow-blue-500/20"
            text={loginMode === 'otp' ? 'Send OTP →' : 'Login Now'}
            loadingText={
              loginMode === 'otp' ? 'Sending OTP...' : 'Logging in...'
            }
            loadingEffect
          />

          <div className="mt-4 text-center text-xs font-medium">
            Don&apos;t have an account?
            <Link
              href={`/register${redirect ? `?redirect=${redirect}` : ''}`}
              className="p-0 pl-1 font-black text-blue-600 hover:underline"
            >
              CREATE ONE
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;

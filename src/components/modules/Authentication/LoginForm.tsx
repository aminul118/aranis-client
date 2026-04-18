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
import useSearchParamsValues from '@/hooks/useSearchParamsValues';
import { requestOTP } from '@/services/auth/otp/sendOTP';
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
      identifier: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setAlert(null); // reset previous alert

    try {
      const res = await requestOTP(values.identifier);

      if (res.success) {
        toast.success('OTP sent to your email/phone');
        router.push(
          `/verify?identifier=${encodeURIComponent(values.identifier)}${redirect ? `&redirect=${redirect}` : ''}`,
        );
      } else {
        setAlert({
          type: 'error',
          title: 'Lookup failed',
          description:
            res.message || 'Unable to request OTP. Please try again.',
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
        className="flex flex-col gap-6"
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

        {/* Identifier */}
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                Email or Phone Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email or phone"
                  className="h-11 rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton
          loading={form.formState.isSubmitting}
          className="h-12 w-full rounded-xl text-lg font-bold shadow-lg shadow-blue-500/20"
          text="Send OTP →"
          loadingText="Sending OTP"
          loadingEffect
        />

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?
          <Link
            href={`/register${redirect ? `?redirect=${redirect}` : ''}`}
            className="p-0 pl-1 font-bold text-blue-500 hover:underline"
          >
            Create one
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;

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
import useSearchParamsValues from '@/hooks/useSearchParamsValues';
import { requestOTP } from '@/services/auth/otp/sendOTP';
import { loginFormValidation } from '@/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';
import { Mail } from 'lucide-react';
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

const OtpLoginForm = () => {
  const { redirect } = useSearchParamsValues('redirect');
  const router = useRouter();
  const [alert, setAlert] = useState<AlertState>(null);

  const form = useForm<any>({
    resolver: zodResolver(loginFormValidation),
    defaultValues: {
      identifier: '',
    },
  });

  const onSubmit = async (values: any) => {
    setAlert(null);

    try {
      const res = await requestOTP(values.identifier, values.turnstileToken);
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
    } catch (error: any) {
      setAlert({
        type: 'error',
        title: 'Something went wrong',
        description:
          error.message || 'Unable to request OTP. Please try again later.',
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

          <div className="flex flex-col gap-2">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => {
                form.setValue('turnstileToken', token);
                form.clearErrors('turnstileToken');
              }}
              onError={() =>
                form.setError('turnstileToken', { message: 'Captcha failed' })
              }
              onExpire={() => form.setValue('turnstileToken', '')}
              options={{ theme: 'auto', size: 'flexible' }}
            />
            {form.formState.errors.turnstileToken && (
              <p className="text-destructive text-sm font-medium">
                {form.formState.errors.turnstileToken.message as string}
              </p>
            )}
          </div>

          <SubmitButton
            loading={form.formState.isSubmitting}
            className="h-12 w-full rounded-full text-sm font-black tracking-widest uppercase shadow-md transition-transform hover:scale-[1.02]"
            text="Send OTP →"
            loadingText="Sending OTP..."
            loadingEffect
            disabled={!form.watch('turnstileToken')}
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

export default OtpLoginForm;

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
import { forgotPassword } from '@/services/auth/password-reset';
import { loginFormValidation } from '@/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AlertPopUp from '../../login/_components/AlertPopUp';

type AlertState = {
  type: 'success' | 'error' | 'info';
  title: string;
  description: string;
} | null;

const ForgotPasswordForm = () => {
  const [alert, setAlert] = useState<AlertState>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginFormValidation),
    defaultValues: {
      identifier: '',
    },
  });

  const onSubmit = async (values: any) => {
    setAlert(null);

    try {
      const res = await forgotPassword(values.identifier);
      if (res.success) {
        setIsSuccess(true);
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.identifier);
        const target = isEmail ? 'email address' : 'mobile number';
        const attemptsText =
          (res as any).data?.remainingAttempts !== undefined
            ? `\nRemaining daily attempts: ${(res as any).data.remainingAttempts}/5`
            : '';
        setAlert({
          type: 'success',
          title: 'Reset Link Sent',
          description: `A password reset link has been successfully sent to your ${target}.${attemptsText}`,
        });
      } else {
        setAlert({
          type: 'error',
          title: 'Request Failed',
          description: res.message || 'Unable to process your request.',
        });
      }
    } catch (error: any) {
      setAlert({
        type: 'error',
        title: 'Something went wrong',
        description:
          error.message ||
          'Unable to process your request. Please try again later.',
      });
    }
  };

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

          {!isSuccess && (
            <>
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                      Email or Phone Number
                    </FormLabel>
                    <FormControl>
                      <IconInput
                        icon={Mail}
                        placeholder="Enter your email or phone"
                        className="focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SubmitButton
                loading={form.formState.isSubmitting}
                className="h-12 w-full rounded-xl text-sm font-black tracking-widest uppercase"
                text="Send Reset Link"
                loadingText="Sending..."
                loadingEffect
              />
            </>
          )}

          <div className="mt-4 text-center text-xs font-medium">
            Remembered your password?{' '}
            <Button variant="link" asChild className="px-0">
              <Link href="/login">Login here</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;

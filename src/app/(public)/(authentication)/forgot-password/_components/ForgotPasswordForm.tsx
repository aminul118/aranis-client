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
        setAlert({
          type: 'success',
          title: 'Reset Link Sent',
          description: `A password reset link has been successfully sent to your ${target}.`,
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
                      <div className="relative">
                        <Mail
                          className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                          size={18}
                        />
                        <Input
                          placeholder="Enter your email or phone"
                          className="focus:border-primary h-12 rounded-xl border-2 pl-10"
                          {...field}
                        />
                      </div>
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
            <Link
              href="/login"
              className="text-primary font-bold transition-colors hover:underline"
            >
              Login here
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;

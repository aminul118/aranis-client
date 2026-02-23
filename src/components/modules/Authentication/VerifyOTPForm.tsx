'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Logo from '@/assets/Logo';
import SubmitButton from '@/components/common/button/submit-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import useSearchParamsValues from '@/hooks/useSearchParamsValues';
import { sendOTP } from '@/services/auth/otp/sendOTP';
import { verifyOTP } from '@/services/auth/otp/verifyOTP';
import {
  getDefaultDashboardRoute,
  UserRole,
} from '@/services/user/user-access';
import { otpValidation } from '@/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { forbidden, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type FormValues = z.infer<typeof otpValidation>;

const VerifyOTPForm = () => {
  const [counter, setCounter] = useState(6); // 1 min timer
  const { email } = useSearchParamsValues('email');
  const router = useRouter();

  // Email no email received -> User can't visit this page
  useEffect(() => {
    if (!email) forbidden();
  }, [email]);

  const form = useForm<FormValues>({
    resolver: zodResolver(otpValidation),
    defaultValues: {
      otp: '',
    },
  });

  // Countdown effect
  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (!email) {
        toast.error('Email Not Found..');
        return;
      }
      const formData = new FormData();
      formData.append('otp', values.otp);
      formData.append('email', email);

      const res = await verifyOTP(formData);
      if (!res.success) {
        toast.error(res.message);
      }
      if (res.success && 'user' in res) {
        router.push(getDefaultDashboardRoute(res.user.role as UserRole));
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    const res = await sendOTP(email);

    if (res.success) {
      toast.success(`OTP sent to ${email}`);
      setCounter(60); // ✅ reset timer
    } else {
      toast.error(res.message || 'Error sending OTP');
    }
  };

  return (
    <div data-aos="fade-left" className="flex items-center justify-center">
      <Card className="w-lg">
        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
          <Link href={'/'}>
            <Logo />
          </Link>
          <CardTitle className="text-center text-xl font-semibold">
            Verify Your Email
          </CardTitle>
          <p className="text-muted-foreground text-center text-sm">
            Enter the 6-digit code we sent to your email
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center gap-6"
            >
              {/* OTP Field */}
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center gap-2">
                    <FormLabel className="sr-only">OTP</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        className="gap-2 text-lg"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage className="mt-4" />
                  </FormItem>
                )}
              />

              <SubmitButton
                loading={form.formState.isSubmitting}
                loadingEffect
                text="Verify"
              />
            </form>
          </Form>

          {/* Resend OTP Section */}
          <div className="text-center text-sm">
            {counter > 0 ? (
              <Button variant="link" disabled className="text-muted-foreground">
                {` Resend available in ${counter}`}
              </Button>
            ) : (
              <Button variant="link" onClick={handleResend}>
                Resend OTP
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOTPForm;

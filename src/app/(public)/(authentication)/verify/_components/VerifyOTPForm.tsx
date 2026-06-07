'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import SubmitButton from '@/components/common/button/submit-button';
import { Button } from '@/components/ui/button';
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
import { requestOTP } from '@/services/auth/otp/sendOTP';
import { verifyOTP } from '@/services/auth/otp/verifyOTP';
import {
  getDefaultDashboardRoute,
  UserRole,
} from '@/services/user/user-access';
import { otpValidation } from '@/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type FormValues = z.infer<typeof otpValidation>;

const VerifyOTPForm = () => {
  const [counter, setCounter] = useState(60); // 1 min timer
  const {
    identifier,
    redirect,
    attemptsLeft: initialAttempts,
  } = useSearchParamsValues('identifier', 'redirect', 'attemptsLeft');
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(
    initialAttempts ? parseInt(initialAttempts, 10) : null,
  );
  const router = useRouter();

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
      if (!identifier) {
        toast.error('Identifier Not Found..');
        return;
      }

      const res = await verifyOTP({ identifier, otp: values.otp });
      if (!res.success) {
        toast.error(res.message);
      } else if (res.user) {
        toast.success(res.message || 'Verified successfully');
        const targetRoute = redirect
          ? redirect.startsWith('/')
            ? redirect
            : `/${redirect}`
          : getDefaultDashboardRoute(res.user.role as UserRole);
        window.location.href = targetRoute;
      } else {
        // This case might happen if OTP verified but user creation is pending (e.g. guest checkout)
        // But for login/register, user should exist by now.
        toast.success('OTP verified');
      }
    } catch (err: any) {
      toast.error(err.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    if (!identifier) return;

    const res = await requestOTP(identifier);

    if (res.success) {
      toast.success(`OTP sent to ${identifier}`);
      setCounter(60); // ✅ reset timer
      if ((res as any).data?.remainingAttempts !== undefined) {
        setAttemptsLeft((res as any).data.remainingAttempts);
      }
    } else {
      toast.error(res.message || 'Error sending OTP');
    }
  };

  return (
    <div data-aos="fade-left" className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          Verify Your Account
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter the 6-digit code sent to {identifier} to secure your access.
        </p>
      </div>

      <div className="space-y-6">
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
              className="mt-4 h-12 w-full rounded-xl text-sm font-black tracking-widest uppercase"
              text="Verify"
              loadingText="Verifying..."
              loadingEffect
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
        {attemptsLeft !== null && (
          <p className="text-muted-foreground mt-2 text-center text-xs font-medium">
            Daily limit remaining: {attemptsLeft}/5
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyOTPForm;

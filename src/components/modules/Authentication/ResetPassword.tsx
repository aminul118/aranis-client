'use client';

import Logo from '@/assets/Logo';
import SubmitButton from '@/components/common/button/submit-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Password from '@/components/ui/password';
import images from '@/config/images';
import { cn } from '@/lib/utils';
import { resetPasswordValidation } from '@/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { forbidden } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type FormValues = z.infer<typeof resetPasswordValidation>;

const ResetPassword = ({ props }: { props: Record<string, any> }) => {
  const { id, token } = props;

  //  token & id -> Required for visit this page
  useEffect(() => {
    if (!id && !token) forbidden();
  }, [id, token]);

  const form = useForm<FormValues>({
    resolver: zodResolver(resetPasswordValidation),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        newPassword: values.password,
        id,
        token,
      };

      console.log(payload);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div
      className={cn('flex items-center justify-center rounded-lg shadow-lg')}
      data-aos="fade-right"
    >
      <Card className="w-full max-w-5xl overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form Section */}
          <div className="flex flex-col justify-center gap-6 p-6 md:p-12">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="grid place-items-center">
                  <Link href={'/'}>
                    <Logo />
                  </Link>
                  <p className="text-muted-foreground mt-4 text-center">
                    Reset your password to access your Smart Healthcare &
                    Research Ltd. portal
                  </p>
                </div>

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Password
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Password
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SubmitButton
                  text="Reset Password"
                  loading={form.formState.isSubmitting}
                  loadingText="Password resetting"
                  loadingEffect
                />
              </form>

              <div className="mt-4 text-center text-sm">
                Back to{' '}
                <Link href="/login">
                  <Button variant="link" className="p-0 pl-1">
                    Login
                  </Button>
                </Link>
              </div>
            </Form>
          </div>

          {/* Image Section */}
          <div className="bg-muted relative hidden md:block">
            <Image
              className="absolute inset-0 h-full w-full object-cover brightness-[0.5] grayscale dark:brightness-[0.2]"
              src={images.auth}
              height={400}
              width={400}
              alt="Reset Password Image"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;

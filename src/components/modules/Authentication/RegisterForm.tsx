/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

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
import { Input } from '@/components/ui/input';
import Password from '@/components/ui/password';
import useSearchParamsValues from '@/hooks/useSearchParamsValues';
import { registerAction } from '@/services/user/register';
import { registrationFormValidation } from '@/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type FormValues = z.infer<typeof registrationFormValidation>;

const RegisterForm = () => {
  const { redirect } = useSearchParamsValues('redirect');
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(registrationFormValidation),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    const { confirmPassword, ...rest } = data;
    try {
      const res = await registerAction(rest);

      if (res.success) {
        toast.success(res.message || 'Registration successful');
        form.reset();
        if (!res.data?.isVerified) {
          router.push(
            `/verify?email=${res.data?.email}${redirect ? `&redirect=${redirect}` : ''}`,
          );
        }
      } else {
        toast.error(res.message || 'Failed to create user');
      }
    } catch (error: any) {
      toast.error('Failed to create user');
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 w-full max-w-sm space-y-6 md:max-w-5xl"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Password type="password" placeholder="********" {...field} />
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
                  <Password type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton
            loading={form.formState.isSubmitting}
            className="w-full"
          />

          <div className="mt-4 text-center text-sm">
            Already have an account?
            <Link href={`/login${redirect ? `?redirect=${redirect}` : ''}`}>
              <Button variant="link" className="p-0 pl-1">
                Sign in
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;

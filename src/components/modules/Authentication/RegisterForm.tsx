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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useSearchParamsValues from '@/hooks/useSearchParamsValues';
import { registerWithOTP } from '@/services/auth/register';
import { registrationFormValidation } from '@/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type FormValues = z.infer<typeof registrationFormValidation>;

const RegisterForm = () => {
  const { redirect } = useSearchParamsValues('redirect');
  const [regMethod, setRegMethod] = useState<'email' | 'phone'>('email');
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(registrationFormValidation),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        email: regMethod === 'email' ? data.email : undefined,
        phone: regMethod === 'phone' ? data.phone : undefined,
      };

      const res = await registerWithOTP(payload);

      if (res.success) {
        const identifier = payload.email || payload.phone;
        toast.success(res.message || 'OTP sent for registration');
        form.reset();
        router.push(
          `/verify?identifier=${encodeURIComponent(identifier!)}${redirect ? `&redirect=${redirect}` : ''}`,
        );
      } else {
        toast.error(res.message || 'Failed to create user');
      }
    } catch (error: any) {
      toast.error('Failed to create user');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    className="h-11 rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    className="h-11 rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <RadioGroup
            defaultValue="email"
            className="grid grid-cols-2 gap-4"
            onValueChange={(val) => setRegMethod(val as 'email' | 'phone')}
          >
            <div>
              <RadioGroupItem
                value="email"
                id="email"
                className="peer sr-only"
              />
              <label
                htmlFor="email"
                className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground flex cursor-pointer flex-col items-center justify-between rounded-xl border-2 p-4 transition-all peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500"
              >
                <Mail className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Email</span>
              </label>
            </div>
            <div>
              <RadioGroupItem
                value="phone"
                id="phone"
                className="peer sr-only"
              />
              <label
                htmlFor="phone"
                className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground flex cursor-pointer flex-col items-center justify-between rounded-xl border-2 p-4 transition-all peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500"
              >
                <Phone className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Phone</span>
              </label>
            </div>
          </RadioGroup>
        </div>

        {regMethod === 'email' ? (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="h-11 rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className="h-11 rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <SubmitButton
          loading={form.formState.isSubmitting}
          className="h-12 w-full rounded-xl text-lg font-bold shadow-lg shadow-blue-500/20"
          text="Get Started →"
        />

        <div className="text-muted-foreground pt-4 text-center text-sm">
          Already have an account?
          <Link href={`/login${redirect ? `?redirect=${redirect}` : ''}`}>
            <Button variant="link" className="p-0 pl-1 font-bold text-blue-500">
              Sign in
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;

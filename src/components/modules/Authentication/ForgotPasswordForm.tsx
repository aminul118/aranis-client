'use client';

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
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { forgotPassword } from '@/services/auth/forgotPassword';
import { forgotPasswordValidation } from '@/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type FormValues = z.infer<typeof forgotPasswordValidation>;

const ForgotPasswordForm = ({ className }: { className?: string }) => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordValidation),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    console.log('Forgot password values:', values);
    const formData = new FormData();
    formData.append('email', values.email);

    try {
      const res = await forgotPassword(formData);
      console.log(res);
      if (res && res.success) {
        toast.success(res.message || 'Check Your email');
      }
      form.reset();
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <div data-aos="fade-right" className={cn('w-full', className)}>
      <Card className="mx-auto w-full max-w-md rounded-2xl shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
          <Logo />
          <CardTitle className="text-center text-xl font-semibold">
            Forgot Password?
          </CardTitle>
          <p className="text-muted-foreground text-center text-sm">
            Enter your email address to reset your password
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SubmitButton
                text="Send"
                icon={<Send />}
                loading={form.formState.isSubmitting}
                loadingText="Sending"
                loadingEffect
              />
            </form>
          </Form>

          <div className="text-center text-sm">
            Back to{' '}
            <Link href="/login">
              <Button variant="link" className="p-0 pl-1">
                Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;

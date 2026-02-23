/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import SubmitButton from '@/components/common/button/submit-button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useActionHandler from '@/hooks/useActionHandler';
import { contactAction } from '@/services/contact/contact';
import { contactSchemaZodValidation } from '@/zod/contact';

import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type FormValues = z.infer<typeof contactSchemaZodValidation>;

const ContactForm = () => {
  const { executePost } = useActionHandler();
  const form = useForm<FormValues>({
    resolver: zodResolver(contactSchemaZodValidation),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    await executePost({
      action: () => contactAction(data),
      success: {
        onSuccess: () => form.reset(),
        message: 'Message send to authority successfully',
        loadingText: 'Message sending to authority..',
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/60">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    autoComplete="name"
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="sr-only">
                  Your full name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/60">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@company.com"
                    autoComplete="email"
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="sr-only">
                  Your email address
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Subject */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">Subject</FormLabel>
              <FormControl>
                <Input
                  placeholder="Discuss about project"
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20"
                  {...field}
                />
              </FormControl>
              <FormDescription className="sr-only">
                Message topic
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">Message</FormLabel>
              <FormControl>
                <Textarea
                  className="h-36 border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20"
                  placeholder="Write your message here..."
                  {...field}
                />
              </FormControl>
              <FormDescription className="sr-only">
                Full message
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton
          loading={form.formState.isSubmitting}
          text="Send Message"
          className="w-full"
          icon={<Send />}
        />
      </form>
    </Form>
  );
};

export default ContactForm;

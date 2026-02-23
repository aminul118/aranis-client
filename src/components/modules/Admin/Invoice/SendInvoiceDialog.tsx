'use client';

import SubmitButton from '@/components/common/button/submit-button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import useActionHandler from '@/hooks/useActionHandler';
import { sendInvoice } from '@/services/invoice/invoice';
import { IInvoice, IModal } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props extends IModal {
  invoice: IInvoice;
}

const formSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

const SendInvoiceDialog = ({ invoice, open, setOpen }: Props) => {
  const { executePost } = useActionHandler();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!invoice?._id) return;

    await executePost({
      action: () => sendInvoice(invoice._id as string, data.email),
      success: {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
        loadingText: 'Invoice sending...',
        message: 'Invoice sent successfully',
      },
      errorMessage: 'Failed to send invoice',
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="lg:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Send Invoice to user's email</AlertDialogTitle>

          <AlertDialogDescription>
            Enter the email address where this invoice should be sent.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@doe.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="destructive" type="button">
                  <X /> Cancel
                </Button>
              </AlertDialogCancel>
              <SubmitButton
                loading={form.formState.isSubmitting}
                text="Send Invoice"
                icon={<Send />}
              />
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SendInvoiceDialog;

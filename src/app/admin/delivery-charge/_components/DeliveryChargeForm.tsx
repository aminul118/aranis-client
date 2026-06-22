'use client';

import SubmitButton from '@/components/common/button/submit-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import GradientTitle from '@/components/ui/gradientTitle';
import { Input } from '@/components/ui/input';
import useActionHandler from '@/hooks/useActionHandler';
import { updateDeliveryCharge } from '@/services/delivery-charge/delivery-charge';
import type { IDeliveryCharge } from '@/services/delivery-charge/delivery-charge.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  insideDhaka: z.coerce.number().min(0, 'Must be at least 0'),
  outsideDhaka: z.coerce.number().min(0, 'Must be at least 0'),
  freeDeliveryThreshold: z.coerce.number().min(0, 'Must be at least 0'),
});

type FormValues = z.infer<typeof formSchema>;

interface DeliveryChargeFormProps {
  initialData: IDeliveryCharge | null;
}

export default function DeliveryChargeForm({
  initialData,
}: DeliveryChargeFormProps) {
  const router = useRouter();
  const { executePost } = useActionHandler();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      insideDhaka: initialData?.insideDhaka ?? 70,
      outsideDhaka: initialData?.outsideDhaka ?? 150,
      freeDeliveryThreshold: initialData?.freeDeliveryThreshold ?? 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    await executePost({
      action: () => updateDeliveryCharge(values),
      success: {
        onSuccess: () => {
          router.refresh();
        },
        loadingText: 'Saving settings...',
        message: 'Delivery charge settings updated successfully!',
      },
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-start">
        <GradientTitle
          title="Delivery Settings"
          description="Manage dynamic shipping costs and free delivery rules"
          className="text-left"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Charges</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="insideDhaka"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inside Dhaka (৳)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="outsideDhaka"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Outside Dhaka (৳)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="freeDeliveryThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Free Delivery Threshold (৳)</FormLabel>
                      <FormDescription className="mb-1 text-[10px]">
                        Orders equal to or above this amount will receive free
                        shipping. Set to 0 to disable.
                      </FormDescription>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <SubmitButton
                    loading={form.formState.isSubmitting}
                    text="Save Changes"
                    loadingEffect
                    loadingText="Saving..."
                    icon={<Save className="h-4 w-4" />}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
import { Switch } from '@/components/ui/switch';
import useActionHandler from '@/hooks/useActionHandler';
import { createOffer, IOffer, updateOffer } from '@/services/offer/offer';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const offerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tag: z.string().min(1, 'Tag is required'),
  discountPercentage: z.coerce.number().min(0).max(100),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof offerSchema>;

interface Props {
  offer?: IOffer;
  onSuccess?: () => void;
}

const OfferForm = ({ offer, onSuccess }: Props) => {
  const router = useRouter();
  const { executePost } = useActionHandler();
  const isEdit = !!offer;

  const form = useForm<FormValues>({
    resolver: zodResolver(offerSchema) as any,
    defaultValues: {
      name: offer?.name || '',
      tag: offer?.tag || '',
      discountPercentage: offer?.discountPercentage || 0,
      startDate: offer?.startDate
        ? new Date(offer.startDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      endDate: offer?.endDate
        ? new Date(offer.endDate).toISOString().split('T')[0]
        : new Date(new Date().setMonth(new Date().getMonth() + 1))
            .toISOString()
            .split('T')[0],
      isActive: offer?.isActive ?? true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEdit && offer) {
      await executePost({
        action: () => updateOffer(offer._id as string, values as any),
        success: {
          onSuccess: () => {
            router.refresh();
            onSuccess?.();
          },
          loadingText: 'Updating offer...',
          message: 'Offer updated successfully',
        },
      });
    } else {
      await executePost({
        action: () => createOffer(values as any),
        success: {
          onSuccess: () => {
            router.refresh();
            onSuccess?.();
          },
          loadingText: 'Creating offer...',
          message: 'Offer created successfully',
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offer Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Winter Sale" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag (ID)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. winter-sale" {...field} />
                </FormControl>
                <FormDescription>
                  Unique identifier used for products.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="discountPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Discount Percentage (%)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
              <div>
                <FormLabel>Active Status</FormLabel>
                <p className="text-muted-foreground text-xs">
                  Disable to hide this offer and its associated products.
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <SubmitButton
            loading={form.formState.isSubmitting}
            text={isEdit ? 'Update Offer' : 'Create Offer'}
            loadingEffect
            icon={
              isEdit ? (
                <Save className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )
            }
          />
        </div>
      </form>
    </Form>
  );
};

export default OfferForm;

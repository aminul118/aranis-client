'use client';

import SubmitButton from '@/components/common/button/submit-button';
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
import { createCoupon, ICoupon, updateCoupon } from '@/services/coupon/coupon';
import { addCouponSchema } from '@/zod/coupon';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type FormValues = z.infer<typeof addCouponSchema>;

interface Props {
  coupon?: ICoupon;
  onSuccess?: () => void;
}

const CouponForm = ({ coupon, onSuccess }: Props) => {
  const router = useRouter();
  const { executePost } = useActionHandler();
  const isEdit = !!coupon;

  const form = useForm<FormValues>({
    resolver: zodResolver(addCouponSchema),
    defaultValues: {
      name: coupon?.name || '',
      code: coupon?.code || '',
      discount: coupon?.discount || 0,
      expiryDate: coupon?.expiryDate
        ? new Date(coupon.expiryDate).toISOString().split('T')[0]
        : '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    const action =
      isEdit && coupon
        ? () => updateCoupon(coupon._id as string, data)
        : () => createCoupon(data as any);

    await executePost({
      action,
      success: {
        onSuccess: () => {
          form.reset();
          router.refresh();
          onSuccess?.();
        },
        loadingText: isEdit ? 'Updating coupon...' : 'Adding coupon...',
        message: isEdit
          ? 'Coupon updated successfully'
          : 'Coupon added successfully',
      },
    });
  };

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Summer Sale" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. SUMMER50"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="20"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-2">
            <SubmitButton
              loading={form.formState.isSubmitting}
              text={isEdit ? 'Update Coupon' : 'Create Coupon'}
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
    </div>
  );
};

export default CouponForm;

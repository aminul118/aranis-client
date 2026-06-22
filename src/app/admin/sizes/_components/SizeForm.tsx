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
import useActionHandler from '@/hooks/useActionHandler';
import { createSize, updateSize } from '@/services/size/size';
import type { ISize } from '@/services/size/size.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const addSizeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  order: z.coerce.number().default(0),
});

type FormValues = z.infer<typeof addSizeSchema>;

interface Props {
  size?: ISize;
  onSuccess?: () => void;
}

const SizeForm = ({ size, onSuccess }: Props) => {
  const router = useRouter();
  const { executePost } = useActionHandler();
  const isEdit = !!size;

  const form = useForm<FormValues>({
    resolver: zodResolver(addSizeSchema) as any,
    defaultValues: {
      name: size?.name || '',
      order: size?.order || 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (isEdit && size) {
      await executePost({
        action: () => updateSize(data, size._id as string),
        success: {
          onSuccess: () => {
            form.reset();
            router.refresh();
            onSuccess?.();
          },
          loadingText: 'Size updating...',
          message: 'Size updated successfully',
        },
      });
    } else {
      await executePost({
        action: () => createSize(data),
        success: {
          onSuccess: () => {
            form.reset();
            router.refresh();
            onSuccess?.();
          },
          loadingText: 'Size adding...',
          message: 'Size added successfully',
        },
      });
    }
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
                <FormLabel>Size Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. XL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Order (optional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-2">
            {onSuccess && (
              <Button type="button" variant="outline" onClick={onSuccess}>
                Cancel
              </Button>
            )}
            <SubmitButton
              loading={form.formState.isSubmitting}
              text={isEdit ? 'Update' : 'Add'}
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

export default SizeForm;

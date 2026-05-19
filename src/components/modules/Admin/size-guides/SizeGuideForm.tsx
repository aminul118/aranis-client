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
import SingleImageUploader from '@/components/ui/single-image-uploader';
import useActionHandler from '@/hooks/useActionHandler';
import {
  createSizeGuide,
  updateSizeGuide,
} from '@/services/size-guide/size-guide';
import { ISizeGuide } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const sizeGuideSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image: z.any(),
});

type FormValues = z.infer<typeof sizeGuideSchema>;

interface Props {
  sizeGuide?: ISizeGuide;
  onSuccess?: () => void;
}

const SizeGuideForm = ({ sizeGuide, onSuccess }: Props) => {
  const router = useRouter();
  const { executePost } = useActionHandler();
  const isEdit = !!sizeGuide;

  const form = useForm<FormValues>({
    resolver: zodResolver(sizeGuideSchema) as any,
    defaultValues: {
      name: sizeGuide?.name || '',
      image: sizeGuide?.image || '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    // Handle image upload if it's a File (though SingleImageUploader usually returns URL if uploaded via helper)
    // Actually, let's use the same logic as PopupBannerForm
    const { uploadToR2 } = await import('@/lib/r2-upload');

    let imageUrl = values.image;
    if ((values.image as any) instanceof File) {
      imageUrl = await uploadToR2(values.image as unknown as File);
    }

    const payload = { ...values, image: imageUrl };

    if (isEdit && sizeGuide) {
      await executePost({
        action: () => updateSizeGuide(payload as ISizeGuide, sizeGuide._id),
        success: {
          onSuccess: () => {
            if (onSuccess) {
              onSuccess();
            } else {
              router.push('/admin/size-guides');
            }
            router.refresh();
          },
          loadingText: 'Updating size guide...',
          message: 'Size guide updated successfully',
        },
      });
    } else {
      await executePost({
        action: () => createSizeGuide(payload as ISizeGuide),
        success: {
          onSuccess: () => {
            if (onSuccess) {
              onSuccess();
            } else {
              router.push('/admin/size-guides');
            }
            router.refresh();
          },
          loadingText: 'Creating size guide...',
          message: 'Size guide created successfully',
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size Guide Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Women's Shirt Size Guide" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Size Guide Image
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <SingleImageUploader
                  defaultValue={field.value}
                  onChange={(file) => field.onChange(file)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <SubmitButton
            loading={form.formState.isSubmitting}
            text={isEdit ? 'Update Size Guide' : 'Create Size Guide'}
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

export default SizeGuideForm;

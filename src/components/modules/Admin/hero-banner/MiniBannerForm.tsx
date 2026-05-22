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
import { Switch } from '@/components/ui/switch';
import useActionHandler from '@/hooks/useActionHandler';
import {
  createMiniBanner,
  IMiniBanner,
  updateMiniBanner,
} from '@/services/hero-banner/hero-banner';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const miniBannerSchema = z.object({
  image: z
    .any()
    .refine(
      (val) =>
        val &&
        (typeof val === 'string' ||
          val instanceof File ||
          (typeof val === 'object' && val !== null)),
      'Image is required',
    ),
  link: z.string().optional().or(z.literal('')),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof miniBannerSchema>;

interface Props {
  banner?: IMiniBanner;
}

const MiniBannerForm = ({ banner }: Props) => {
  const router = useRouter();
  const { executePost } = useActionHandler();
  const isEdit = !!banner;

  const form = useForm<FormValues>({
    resolver: zodResolver(miniBannerSchema) as any,
    defaultValues: {
      image: banner?.image || '',
      link: banner?.link || '',
      order: banner?.order ?? 0,
      isActive: banner?.isActive ?? true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (isEdit && banner) {
      await executePost({
        action: () => updateMiniBanner(formData, banner._id as string),
        success: {
          onSuccess: () => {
            router.push('/admin/mini-banners');
            router.refresh();
          },
          loadingText: 'Updating mini banner...',
          message: 'Mini banner updated successfully',
        },
      });
    } else {
      await executePost({
        action: () => createMiniBanner(formData),
        success: {
          onSuccess: () => {
            router.push('/admin/mini-banners');
            router.refresh();
          },
          loadingText: 'Creating mini banner...',
          message: 'Mini banner created successfully',
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Banner Image
              </FormLabel>
              <FormControl>
                <SingleImageUploader
                  defaultValue={field.value}
                  onChange={(file) => field.onChange(file)}
                  recommendation="Recommended Size: 600x400px (3:2 aspect ratio) for best display on all devices."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link (URL)</FormLabel>
                <FormControl>
                  <Input placeholder="/shop" {...field} />
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
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
                <FormLabel>Active</FormLabel>
                <p className="text-muted-foreground text-xs">
                  Show this mini banner on the home page.
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
            text={isEdit ? 'Update Mini Banner' : 'Create Mini Banner'}
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

export default MiniBannerForm;

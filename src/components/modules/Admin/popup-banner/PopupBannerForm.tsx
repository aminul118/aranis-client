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
  createPopupBanner,
  IPopupBanner,
  updatePopupBanner,
} from '@/services/popup-banner/popup-banner';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const popupBannerSchema = z.object({
  image: z.string().min(1, 'Image is required'),
  link: z.string().optional().or(z.literal('')),
  title: z.string().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof popupBannerSchema>;

interface Props {
  banner?: IPopupBanner;
}

const PopupBannerForm = ({ banner }: Props) => {
  const router = useRouter();
  const { executePost } = useActionHandler();
  const isEdit = !!banner;

  const form = useForm<FormValues>({
    resolver: zodResolver(popupBannerSchema) as any,
    defaultValues: {
      image: banner?.image || '',
      link: banner?.link || '/offers',
      title: banner?.title || '',
      isActive: banner?.isActive ?? true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEdit && banner) {
      await executePost({
        action: () =>
          updatePopupBanner(values as IPopupBanner, banner._id as string),
        success: {
          onSuccess: () => {
            router.push('/admin/popup-banners');
            router.refresh();
          },
          loadingText: 'Updating popup banner...',
          message: 'Popup banner updated successfully',
        },
      });
    } else {
      await executePost({
        action: () => createPopupBanner(values as IPopupBanner),
        success: {
          onSuccess: () => {
            router.push('/admin/popup-banners');
            router.refresh();
          },
          loadingText: 'Creating popup banner...',
          message: 'Popup banner created successfully',
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
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <SingleImageUploader
                  defaultValue={field.value}
                  onChange={(file) => field.onChange(file)}
                />
              </FormControl>
              <p className="text-muted-foreground mt-1 text-xs">
                This image will appear as a popup when users visit the website.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Eid Special Offers" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link / Destination URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="/offers or /shop?featured=true"
                    {...field}
                  />
                </FormControl>
                <p className="text-muted-foreground mt-1 text-xs">
                  Clicking the popup will redirect to this URL.
                </p>
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
                  Only one active popup will be shown to visitors at a time.
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
            text={isEdit ? 'Update Popup Banner' : 'Create Popup Banner'}
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

export default PopupBannerForm;

'use client';

import SubmitButton from '@/components/common/button/submit-button';
import PlateRichEditor from '@/components/rich-text/core/rich-editor';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SingleImageUploader from '@/components/ui/single-image-uploader';
import { Textarea } from '@/components/ui/textarea';
import useActionHandler from '@/hooks/useActionHandler';
import { cn } from '@/lib/utils';
import {
  createGiftCard,
  IGiftCard,
  updateGiftCard,
} from '@/services/giftcard/giftcard';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const giftCardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be greater than or equal to 0'),
  discountPercentage: z.coerce.number().min(0).max(100).default(0),
  validityDays: z.coerce.number().min(1, 'Validity days must be at least 1'),
  status: z.enum(['active', 'inactive']).default('active'),
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
  seo: z.object({
    title: z.string().min(1, 'SEO title is required'),
    description: z.string().min(1, 'SEO description is required'),
    keywords: z.string().min(1, 'SEO keywords are required'),
  }),
});

type FormValues = z.infer<typeof giftCardSchema>;

interface Props {
  giftCard?: IGiftCard;
}

const GiftCardForm = ({ giftCard }: Props) => {
  const router = useRouter();
  const { executePost } = useActionHandler();
  const isEdit = !!giftCard;

  const form = useForm<FormValues>({
    resolver: zodResolver(giftCardSchema) as any,
    defaultValues: {
      name: giftCard?.name || '',
      description: giftCard?.description || '',
      price: giftCard?.price || 0,
      discountPercentage: giftCard?.discountPercentage || 0,
      validityDays: giftCard?.validityDays || 365,
      status: giftCard?.status || 'active',
      image: giftCard?.image || '',
      seo: {
        title: giftCard?.seo?.title || '',
        description: giftCard?.seo?.description || '',
        keywords: giftCard?.seo?.keywords || '',
      },
    },
  });

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'seo') {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (isEdit && giftCard) {
      await executePost({
        action: () => updateGiftCard(giftCard._id as string, formData),
        success: {
          onSuccess: () => {
            router.push('/admin/gift-cards');
            router.refresh();
          },
          loadingText: 'Updating gift card...',
          message: 'Gift card updated successfully',
        },
      });
    } else {
      await executePost({
        action: () => createGiftCard(formData),
        success: {
          onSuccess: () => {
            router.push('/admin/gift-cards');
            router.refresh();
          },
          loadingText: 'Creating gift card...',
          message: 'Gift card created successfully',
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Gift Card Image
              </FormLabel>
              <FormControl>
                <SingleImageUploader
                  defaultValue={field.value}
                  onChange={(file) => field.onChange(file)}
                  recommendation="Recommended aspect ratio 16:9 or 3:2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. $50 Premium Gift Card" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Percentage (%)</FormLabel>
                <FormControl>
                  <Input type="number" max="100" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="validityDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validity (Days)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <PlateRichEditor
                  value={field.value || ''}
                  onChange={(val) => field.onChange(val)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-muted/5 space-y-4 rounded-xl border border-white/10 p-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black tracking-tight uppercase">
              SEO Configuration
            </h3>
            <p className="text-muted-foreground text-xs font-medium">
              Define custom metadata for Search Engine Optimization.
            </p>
          </div>

          <FormField
            control={form.control}
            name="seo.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Meta Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Premium $50 Gift Card | Aranis"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="flex justify-between">
                  <span>Ideal length: 50-60 characters.</span>
                  <span
                    className={cn(
                      (field.value?.length || 0) > 60
                        ? 'font-bold text-red-500'
                        : 'text-muted-foreground',
                    )}
                  >
                    {field.value?.length || 0} / 60
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seo.keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Meta Keywords <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. gift card, present, store credit"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Comma-separated keywords.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="seo.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Meta Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="h-36"
                    placeholder="A brief description of this gift card for search engines..."
                    {...field}
                  />
                </FormControl>
                <FormDescription className="flex justify-between">
                  <span>Ideal length: 150-160 characters.</span>
                  <span
                    className={cn(
                      (field.value?.length || 0) > 160
                        ? 'font-bold text-red-500'
                        : 'text-muted-foreground',
                    )}
                  >
                    {field.value?.length || 0} / 160
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <SubmitButton
            loading={form.formState.isSubmitting}
            text={isEdit ? 'Update Gift Card' : 'Create Gift Card'}
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

export default GiftCardForm;

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
import { Switch } from '@/components/ui/switch';
import SingleImageUploader from '@/components/ui/single-image-uploader';
import useActionHandler from '@/hooks/useActionHandler';
import {
    createMiniBanner,
    updateMiniBanner,
    IMiniBanner,
} from '@/services/hero-banner/hero-banner';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const miniBannerSchema = z.object({
    image: z.string().min(1, 'Image is required'),
    label: z.string().min(1, 'Label is required'),
    title: z.string().min(1, 'Title is required'),
    href: z.string().min(1, 'Link is required'),
    accent: z.string().min(1, 'Accent gradient is required'),
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
            label: banner?.label || '',
            title: banner?.title || '',
            href: banner?.href || '/shop',
            accent: banner?.accent || 'from-purple-600/80 to-indigo-800/90',
            order: banner?.order ?? 0,
            isActive: banner?.isActive ?? true,
        },
    });

    const onSubmit = async (values: FormValues) => {
        if (isEdit && banner) {
            await executePost({
                action: () => updateMiniBanner(values as IMiniBanner, banner._id as string),
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
                action: () => createMiniBanner(values as IMiniBanner),
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
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Small Label</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Featured Picks" {...field} />
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
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Staff Favourites" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="href"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link (URL)</FormLabel>
                            <FormControl>
                                <Input placeholder="/shop?featured=true" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="accent"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Accent Gradient (Tailwind)</FormLabel>
                            <FormControl>
                                <Input placeholder="from-purple-600/80 to-indigo-800/90" {...field} />
                            </FormControl>
                            <p className="text-xs text-muted-foreground mt-1">Applied as an overlay gradient on the banner image.</p>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                            <div>
                                <FormLabel>Active</FormLabel>
                                <p className="text-xs text-muted-foreground">Show this mini banner on the home page.</p>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end pt-4">
                    <SubmitButton
                        loading={form.formState.isSubmitting}
                        text={isEdit ? 'Update Mini Banner' : 'Create Mini Banner'}
                        loadingEffect
                        icon={isEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    />
                </div>
            </form>
        </Form>
    );
};

export default MiniBannerForm;

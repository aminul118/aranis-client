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
    createHeroBanner,
    updateHeroBanner,
    IHeroBanner,
} from '@/services/hero-banner/hero-banner';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const heroBannerSchema = z.object({
    image: z.string().min(1, 'Image is required'),
    tag: z.string().min(1, 'Tag is required'),
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
    cta: z.string().min(1, 'CTA text is required'),
    ctaHref: z.string().min(1, 'CTA link is required'),
    accentColor: z.string().min(1, 'Accent color is required'),
    bgGlow: z.string().min(1, 'Background glow is required'),
    order: z.coerce.number().default(0),
    isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof heroBannerSchema>;

interface Props {
    banner?: IHeroBanner;
}

const HeroBannerForm = ({ banner }: Props) => {
    const router = useRouter();
    const { executePost } = useActionHandler();
    const isEdit = !!banner;

    const form = useForm<FormValues>({
        resolver: zodResolver(heroBannerSchema) as any,
        defaultValues: {
            image: banner?.image || '',
            tag: banner?.tag || '',
            title: banner?.title || '',
            subtitle: banner?.subtitle || '',
            cta: banner?.cta || 'Shop Now',
            ctaHref: banner?.ctaHref || '/shop',
            accentColor: banner?.accentColor || 'from-blue-600 to-cyan-400',
            bgGlow: banner?.bgGlow || 'bg-blue-600/20',
            order: banner?.order ?? 0,
            isActive: banner?.isActive ?? true,
        },
    });

    const onSubmit = async (values: FormValues) => {
        if (isEdit && banner) {
            await executePost({
                action: () => updateHeroBanner(values as IHeroBanner, banner._id as string),
                success: {
                    onSuccess: () => {
                        router.push('/admin/hero-banners');
                        router.refresh();
                    },
                    loadingText: 'Updating banner...',
                    message: 'Hero banner updated successfully',
                },
            });
        } else {
            await executePost({
                action: () => createHeroBanner(values as IHeroBanner),
                success: {
                    onSuccess: () => {
                        router.push('/admin/hero-banners');
                        router.refresh();
                    },
                    loadingText: 'Creating banner...',
                    message: 'Hero banner created successfully',
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
                        name="tag"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tag / Badge</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. New Collection 2026" {...field} />
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
                                <Input placeholder="e.g. Elevate Your\nSignature Style" {...field} />
                            </FormControl>
                            <p className="text-xs text-muted-foreground mt-1">Use \n to break the title into two lines (second line gets the accent color).</p>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subtitle</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Up to 40% OFF on premium fashion picks." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="cta"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CTA Button Text</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Shop Now" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ctaHref"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CTA Link (URL)</FormLabel>
                                <FormControl>
                                    <Input placeholder="/shop" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="accentColor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Accent Color (Tailwind gradient)</FormLabel>
                                <FormControl>
                                    <Input placeholder="from-blue-600 to-cyan-400" {...field} />
                                </FormControl>
                                <p className="text-xs text-muted-foreground mt-1">Applied to title second line & CTA button gradient.</p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bgGlow"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Glow (Tailwind class)</FormLabel>
                                <FormControl>
                                    <Input placeholder="bg-blue-600/20" {...field} />
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
                                <p className="text-xs text-muted-foreground">Show this slide on the home page.</p>
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
                        text={isEdit ? 'Update Banner' : 'Create Banner'}
                        loadingEffect
                        icon={isEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    />
                </div>
            </form>
        </Form>
    );
};

export default HeroBannerForm;

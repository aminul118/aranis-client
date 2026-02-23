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
import { Button } from '@/components/ui/button';
import useActionHandler from '@/hooks/useActionHandler';
import { createNavbar, updateNavbar, INavItem } from '@/services/navbar/navbar';
import { addNavItemSchema } from '@/zod/navbar';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

interface FormValues {
    title: string;
    href: string;
    order: string | number;
    subItems: {
        title: string;
        href: string;
        items: string | string[];
    }[];
}

interface Props {
    navbar?: INavItem;
}

const NavbarForm = ({ navbar }: Props) => {
    const router = useRouter();
    const { executePost } = useActionHandler();
    const isEdit = !!navbar;

    const form = useForm<FormValues>({
        resolver: zodResolver(addNavItemSchema) as any,
        defaultValues: {
            title: navbar?.title || '',
            href: navbar?.href || '',
            order: navbar?.order || 0,
            subItems: navbar?.subItems?.map(item => ({
                ...item,
                items: Array.isArray(item.items) ? item.items.join(', ') : item.items
            })) || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'subItems',
    });

    const onSubmit = async (values: any) => {
        const data = values as z.infer<typeof addNavItemSchema>;
        const payload = {
            ...data,
            order: Number(data.order),
        };

        if (isEdit && navbar) {
            await executePost({
                action: () => updateNavbar(payload as any, navbar._id as string),
                success: {
                    onSuccess: () => {
                        router.push('/admin/navbar');
                        router.refresh();
                    },
                    loadingText: 'Navbar updating...',
                    message: 'Navbar updated successfully',
                },
            });
        } else {
            await executePost({
                action: () => createNavbar(payload as INavItem),
                success: {
                    onSuccess: () => {
                        router.push('/admin/navbar');
                        router.refresh();
                    },
                    loadingText: 'Navbar item adding...',
                    message: 'Navbar item added successfully',
                },
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Menu Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Shop, Collections" {...field} />
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
                                    <Input placeholder="/shop" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

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

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <FormLabel>Sub Items (Mega Menu)</FormLabel>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ title: '', href: '', items: [] })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Section
                        </Button>
                    </div>
                    {fields.map((field, index) => (
                        <div key={field.id} className="rounded-lg border border-white/10 p-4 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-1 space-y-4">
                                    <FormField
                                        control={form.control}
                                        name={`subItems.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Section Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Categories, Brands" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`subItems.${index}.items`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Links (comma separated)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Men, Women, Accessories"
                                                        value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="mt-8 text-destructive"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <SubmitButton
                        loading={form.formState.isSubmitting}
                        text={isEdit ? 'Update Menu Item' : 'Add Menu Item'}
                        loadingEffect
                        icon={isEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    />
                </div>
            </form>
        </Form>
    );
};

export default NavbarForm;

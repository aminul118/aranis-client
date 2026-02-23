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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { Checkbox } from '@/components/ui/checkbox';
import SingleImageUploader from '@/components/ui/single-image-uploader';
import useActionHandler from '@/hooks/useActionHandler';
import { ICategory } from '@/services/category/category';
import { IColor } from '@/services/color/color';
import { createProduct, IProduct, updateProduct } from '@/services/product/product';
import { addProductSchema, updateProductSchema } from '@/zod/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Suspense } from 'react';
import PlateRichEditor from '@/components/rich-text/core/rich-editor';
import { toast } from 'sonner';
import MultiImageUploader from '@/components/ui/multi-image-uploader';

type FormValues = {
    name: string;
    category: string;
    subCategory: string;
    type: string;
    price: number | string;
    salePrice: number | string;
    slug: string;
    description: string;
    details: string;
    colors: string[];
    sizes: string[];
    featured: boolean;
    rating: number | string;
    image?: any;
    images: string[];
};

interface Props {
    product?: IProduct;
    categories: ICategory[];
    colors: IColor[];
}

const ProductForm = ({ product, categories, colors }: Props) => {
    const router = useRouter();
    const { executePost } = useActionHandler();
    const isEdit = !!product;
    const schema = isEdit ? updateProductSchema : addProductSchema;

    const form = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            name: product?.name || '',
            category: product?.category || '',
            subCategory: product?.subCategory || '',
            type: product?.type || '',
            price: product?.price || 0,
            slug: product?.slug || '',
            salePrice: product?.salePrice || 0,
            description: product?.description || '',
            details: (product?.details as string) || '',
            colors: product?.colors || [],
            sizes: product?.sizes || [],
            featured: product?.featured || false,
            rating: product?.rating || 0,
            images: product?.images || [],
        },
    });

    const selectedCategory = categories.find((c) => c.name === form.watch('category'));
    const subCategories = selectedCategory?.subCategories || [];
    const selectedSubCategory = subCategories.find((s) => s.title === form.watch('subCategory'));
    const types = selectedSubCategory?.items || [];

    const onSubmit = async (data: FormValues) => {
        const payload = {
            ...data,
            price: Number(data.price),
            salePrice: Number(data.salePrice),
            rating: Number(data.rating),
            details: data.details || '',
        };

        const handleServerErrors = (res: any) => {
            // If the server returns field-level errors, map them into the form
            if (res?.errorDetails && Array.isArray(res.errorDetails)) {
                res.errorDetails.forEach((err: { path?: string; message?: string }) => {
                    if (err.path && err.message) {
                        form.setError(err.path as keyof FormValues, {
                            type: 'server',
                            message: err.message,
                        });
                    }
                });
            }
            // Also handle Zod-style errors object: { field: ['message'] }
            if (res?.errors && typeof res.errors === 'object') {
                Object.entries(res.errors).forEach(([field, msgs]) => {
                    const message = Array.isArray(msgs) ? msgs[0] : String(msgs);
                    form.setError(field as keyof FormValues, {
                        type: 'server',
                        message,
                    });
                });
            }
        };

        if (isEdit && product) {
            const res = await updateProduct(payload as Partial<IProduct>, product._id as string);
            if (res?.success) {
                toast.success('Product updated successfully');
                router.push('/admin/products');
                router.refresh();
            } else {
                toast.error(res?.message || 'Failed to update product');
                handleServerErrors(res);
            }
        } else {
            await executePost({
                action: () => createProduct(payload as IProduct),
                success: {
                    onSuccess: () => {
                        router.push('/admin/products');
                        router.refresh();
                    },
                    loadingText: 'Product adding...',
                    message: 'Product added successfully',
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Classic Silk Shirt" {...field} />
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
                        name="salePrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sale Price ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormDescription>Set to 0 if no discount.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug (Unique ID)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. classic-silk-shirt" {...field} />
                                </FormControl>
                                <FormDescription>Auto-generated from name if left empty.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subCategory"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sub Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.watch('category')}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Sub Category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {subCategories.map(s => <SelectItem key={s.title} value={s.title}>{s.title}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.watch('subCategory')}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                                <SingleImageUploader
                                    defaultValue={field.value as string}
                                    onChange={(file) => field.onChange(file)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Suspense fallback={<div>Loading editor…</div>}>
                                    <PlateRichEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </Suspense>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Details</FormLabel>
                            <FormControl>
                                <Suspense fallback={<div>Loading editor…</div>}>
                                    <PlateRichEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </Suspense>
                            </FormControl>
                            <FormDescription>Use headings, lists, and formatting to design your product details page.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="colors"
                        render={() => (
                            <FormItem>
                                <FormLabel>Available Colors</FormLabel>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    {colors.map((color) => (
                                        <FormField
                                            key={color._id}
                                            control={form.control}
                                            name="colors"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(color.name)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, color.name])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== color.name
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="flex items-center gap-2 font-normal cursor-pointer">
                                                            {color.hex && <div className="h-3 w-3 rounded-full border border-white/10" style={{ backgroundColor: color.hex }} />}
                                                            {color.name}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sizes"
                        render={() => (
                            <FormItem>
                                <FormLabel>Available Sizes</FormLabel>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map((size) => (
                                        <FormField
                                            key={size}
                                            control={form.control}
                                            name="sizes"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(size)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, size])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== size
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer text-xs">
                                                            {size}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/10 p-4 shadow-sm">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Featured Product</FormLabel>
                                <FormDescription>
                                    This product will be highlighted on the home page.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                {/* Gallery Images */}
                <div className="rounded-xl border border-border/50 p-5 bg-muted/20">
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <MultiImageUploader
                                    label="Gallery Images (shown on product detail page)"
                                    value={field.value || []}
                                    onChange={field.onChange}
                                    max={8}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <SubmitButton
                        loading={form.formState.isSubmitting}
                        text={isEdit ? 'Update Product' : 'Add Product'}
                        loadingEffect
                        icon={isEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    />
                </div>
            </form>
        </Form>
    );
};

export default ProductForm;

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
import { Check, Plus, Save, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Suspense, useEffect } from 'react';
import PlateRichEditor from '@/components/rich-text/core/rich-editor';
import { toast } from 'sonner';
import MultiImageUploader from '@/components/ui/multi-image-uploader';
import { cn } from '@/lib/utils';

type FormValues = {
    name: string;
    category: string;
    subCategory: string;
    type: string;
    price: number | string;
    salePrice: number | string;
    buyPrice: number | string;
    stock: number | string;
    slug: string;
    description: string;
    details: string;
    color: string;
    sizes: string[];
    featured: boolean;
    rating: number | string;
    image?: any;
    images: (string | File)[];
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
            buyPrice: product?.buyPrice || 0,
            stock: product?.stock || 0,
            slug: product?.slug || '',
            salePrice: product?.salePrice || 0,
            description: product?.description || '',
            details: (product?.details as string) || '',
            color: product?.color || '',
            sizes: product?.sizes || [],
            featured: product?.featured || false,
            rating: product?.rating || 0,
            images: product?.images || [],
        },
    });

    const watchedColor = form.watch('color');
    const watchedSizes = form.watch('sizes');

    const selectedCategory = categories.find((c) => c.name === form.watch('category'));
    const subCategories = selectedCategory?.subCategories || [];
    const selectedSubCategory = subCategories.find((s) => s.title === form.watch('subCategory'));
    const types = selectedSubCategory?.items || [];

    const onSubmit = async (data: FormValues) => {
        const formData = new FormData();

        // Basic fields
        formData.append('name', data.name);
        formData.append('price', String(data.price));
        formData.append('buyPrice', String(data.buyPrice));
        formData.append('stock', String(data.stock));
        formData.append('salePrice', String(data.salePrice));
        formData.append('description', data.description);
        formData.append('details', data.details || '');
        formData.append('category', data.category);
        formData.append('subCategory', data.subCategory);
        formData.append('type', data.type);
        formData.append('slug', data.slug);
        formData.append('featured', String(data.featured));
        formData.append('rating', String(data.rating));

        // Arrays (Stringify for backend to parse)
        formData.append('color', data.color);
        formData.append('sizes', JSON.stringify(data.sizes));

        // Single Image
        if ((data.image as any) instanceof File) {
            formData.append('image', data.image as any);
        } else if (typeof data.image === 'string') {
            formData.append('image', data.image);
        }

        // Gallery Images (General)
        const existingGalleryUrls: string[] = [];
        data.images.forEach((item: any) => {
            if (typeof item === 'string') {
                existingGalleryUrls.push(item);
            } else if (item instanceof File) {
                formData.append('images', item);
            }
        });
        formData.append('images', JSON.stringify(existingGalleryUrls));

        if (isEdit && product) {
            const res = await updateProduct(formData as any, product._id as string);
            if (res?.success) {
                toast.success('Product updated successfully');
                router.push('/admin/products');
                router.refresh();
            } else {
                toast.error(res?.message || 'Failed to update product');
            }
        } else {
            await executePost({
                action: () => createProduct(formData as any),
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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
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
                        name="buyPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Buy Price ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
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
                                <FormLabel>Sale Price ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock Count</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="salePrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discounted Price ($)</FormLabel>
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
                {/* Product Color & Sizes */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Color</FormLabel>
                                <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-border/50 bg-muted/10">
                                    {colors.map((color) => (
                                        <button
                                            key={color.name}
                                            type="button"
                                            onClick={() => field.onChange(color.name)}
                                            className={cn(
                                                "group relative flex flex-col items-center gap-2 transition-all",
                                                field.value === color.name ? "scale-110" : "opacity-60 hover:opacity-100"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "h-10 w-10 rounded-full border-2 transition-all flex items-center justify-center",
                                                    field.value === color.name ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-transparent"
                                                )}
                                                style={{ backgroundColor: color.hex }}
                                            >
                                                {field.value === color.name && (
                                                    <Check className={cn(
                                                        "h-5 w-5",
                                                        ["White", "Beige", "Silk White", "Gold"].includes(color.name) ? "text-black" : "text-white"
                                                    )} />
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">{color.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="sizes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Available Sizes</FormLabel>
                                <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-border/50 bg-muted/10">
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => {
                                                const current = field.value || [];
                                                const updated = current.includes(size)
                                                    ? current.filter((s: string) => s !== size)
                                                    : [...current, size];
                                                field.onChange(updated);
                                            }}
                                            className={cn(
                                                "min-w-[3rem] px-4 py-2 rounded-lg border text-xs font-black transition-all",
                                                field.value?.includes(size)
                                                    ? "bg-foreground text-background border-foreground shadow-md"
                                                    : "border-border/50 bg-background text-muted-foreground hover:border-foreground/30"
                                            )}
                                        >
                                            {size}
                                        </button>
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


                {/* Gallery Images (General) */}
                <div className="rounded-xl border border-border/50 p-5 bg-muted/20">
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <MultiImageUploader
                                    label="General Gallery Images"
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

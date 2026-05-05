'use client';

import SubmitButton from '@/components/common/button/submit-button';
import PlateRichEditor from '@/components/rich-text/core/rich-editor';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import MultiImageUploader from '@/components/ui/multi-image-uploader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SingleImageUploader from '@/components/ui/single-image-uploader';
import useActionHandler from '@/hooks/useActionHandler';
import { cn } from '@/lib/utils';
import { ICategory } from '@/services/category/category';
import { IColor } from '@/services/color/color';
import {
  createProduct,
  IProduct,
  updateProduct,
} from '@/services/product/product';
import { addProductSchema, updateProductSchema } from '@/zod/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import QuickAddCategory from '../categories/QuickAddCategory';
import QuickAddColor from '../colors/QuickAddColor';

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
  variants: {
    color: string;
    sizes: {
      size: string;
      stock: number | string;
    }[];
    images: (string | File)[];
    sku: string;
  }[];
  sizes: string[];
  featured: boolean;
  rating: number | string;
  isOffer: boolean;
  offerTag: string;
  discountPercentage: number | string;
  image?: any;
  sizeStock: {
    size: string;
    stock: number | string;
  }[];
  images: (string | File)[];
  sku: string;
  videoUrl: string;
};

interface Props {
  product?: IProduct;
  categories: ICategory[];
  colors: IColor[];
}

const ProductForm = ({ product, categories, colors }: Props) => {
  const router = useRouter();
  const { executePost } = useActionHandler();
  const [localCategories, setLocalCategories] = useState(categories);
  const [localColors, setLocalColors] = useState(colors);
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
      details: Array.isArray(product?.details)
        ? (product?.details as string[]).join('\n')
        : (product?.details as string) || '',
      color: product?.color || '',
      variants:
        product?.variants?.map((v) => ({
          ...v,
          sizes: v.sizes || [],
        })) || [],
      sizes: product?.sizes || [],
      featured: product?.featured || false,
      rating: product?.rating || 0,
      isOffer: product?.isOffer || false,
      offerTag: product?.offerTag || '',
      discountPercentage: product?.discountPercentage || 0,
      sizeStock: product?.sizeStock || [],
      images: product?.images || [],
      sku: product?.sku || '',
      videoUrl: product?.videoUrl || '',
    },
  });

  // Ensure form is populated when product data is available (for Edit mode)
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || '',
        category: product.category || '',
        subCategory: product.subCategory || '',
        type: product.type || '',
        price: product.price || 0,
        buyPrice: product.buyPrice || 0,
        stock: product.stock || 0,
        slug: product.slug || '',
        salePrice: product.salePrice || 0,
        description: product.description || '',
        details: Array.isArray(product.details)
          ? (product.details as string[]).join('\n')
          : (product.details as string) || '',
        color: product.color || '',
        variants:
          product.variants?.map((v) => ({
            ...v,
            sizes: v.sizes || [],
          })) || [],
        sizes: product.sizes || [],
        featured: product.featured || false,
        rating: product.rating || 0,
        isOffer: product.isOffer || false,
        offerTag: product.offerTag || '',
        discountPercentage: product.discountPercentage || 0,
        sizeStock: product.sizeStock || [],
        images: product.images || [],
        sku: product.sku || '',
        videoUrl: product.videoUrl || '',
      });
    }
  }, [product, form]);

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  const watchedColor = form.watch('color');
  const watchedSizes = form.watch('sizes');
  const watchedPrice = form.watch('price');
  const watchedSalePrice = form.watch('salePrice');
  const watchedDiscountPercentage = form.watch('discountPercentage');
  const watchedIsOffer = form.watch('isOffer');

  // Auto-calculate Discount Percentage when Sale Price changes
  useEffect(() => {
    const price = Number(watchedPrice);
    const salePrice = Number(watchedSalePrice);
    if (price > 0 && salePrice > 0 && salePrice < price) {
      const percentage = Math.round(((price - salePrice) / price) * 100);
      if (percentage !== Number(form.getValues('discountPercentage'))) {
        form.setValue('discountPercentage', percentage);
      }
    } else if (salePrice === 0 || salePrice >= price) {
      if (Number(form.getValues('discountPercentage')) !== 0) {
        form.setValue('discountPercentage', 0);
      }
    }
  }, [watchedSalePrice, watchedPrice, form]);

  // Auto-calculate Sale Price when Discount Percentage changes
  useEffect(() => {
    const price = Number(watchedPrice);
    const percentage = Number(watchedDiscountPercentage);
    if (price > 0 && percentage > 0 && percentage < 100) {
      const salePrice = Math.round(price - (price * percentage) / 100);
      if (salePrice !== Number(form.getValues('salePrice'))) {
        form.setValue('salePrice', salePrice);
      }
    }
  }, [watchedDiscountPercentage, watchedPrice, form]);

  const selectedCategory = localCategories.find(
    (c) => c.name === form.watch('category'),
  );

  // Sync variants sizes when main sizes array changes
  useEffect(() => {
    const mainSizes = watchedSizes || [];

    // Sync main product sizeStock
    const currentMainSizeStock = form.getValues('sizeStock') || [];
    const updatedMainSizeStock = mainSizes.map((size) => {
      const existing = currentMainSizeStock.find((s) => s.size === size);
      return existing || { size, stock: 0 };
    });

    if (
      JSON.stringify(currentMainSizeStock) !==
      JSON.stringify(updatedMainSizeStock)
    ) {
      form.setValue('sizeStock', updatedMainSizeStock, {
        shouldValidate: true,
      });
    }

    // Sync variants sizes
    const currentVariants = form.getValues('variants') || [];
    const updatedVariants = currentVariants.map((variant) => {
      const existingSizes = variant.sizes || [];
      const filteredSizes = existingSizes.filter((s) =>
        mainSizes.includes(s.size),
      );
      const newSizes = mainSizes
        .filter((s) => !filteredSizes.some((fs) => fs.size === s))
        .map((s) => ({ size: s, stock: 0 }));

      return {
        ...variant,
        sizes: [...filteredSizes, ...newSizes],
      };
    });

    if (JSON.stringify(currentVariants) !== JSON.stringify(updatedVariants)) {
      form.setValue('variants', updatedVariants, { shouldValidate: true });
    }
  }, [watchedSizes, form]);

  // Auto-calculate total stock from size-wise stock
  const watchedSizeStock = form.watch('sizeStock');
  const watchedVariants = form.watch('variants');

  useEffect(() => {
    let totalStock = 0;

    // Sum main color size stock
    watchedSizeStock?.forEach((s) => {
      totalStock += Number(s.stock) || 0;
    });

    // Sum all variants size stock
    watchedVariants?.forEach((v) => {
      v.sizes?.forEach((s) => {
        totalStock += Number(s.stock) || 0;
      });
    });

    form.setValue('stock', totalStock);
  }, [watchedSizeStock, watchedVariants, form]);

  const subCategories = selectedCategory?.subCategories || [];
  const selectedSubCategory = subCategories.find(
    (s) => s.title === form.watch('subCategory'),
  );
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
    formData.append('isOffer', String(data.isOffer));
    formData.append('offerTag', data.offerTag);
    formData.append('discountPercentage', String(data.discountPercentage));
    formData.append('videoUrl', data.videoUrl || '');

    // Arrays (Stringify for backend to parse)
    formData.append('color', data.color);
    formData.append('sizes', JSON.stringify(data.sizes || []));
    formData.append('sku', data.sku);
    formData.append(
      'sizeStock',
      JSON.stringify(
        (data.sizeStock || []).map((s) => ({
          size: s.size,
          stock: Number(s.stock) || 0,
        })),
      ),
    );

    // Single Image
    if ((data.image as any) instanceof File) {
      formData.append('image', data.image as any);
    } else if (typeof data.image === 'string') {
      formData.append('image', data.image);
    }

    // Gallery Images (General)
    const existingGalleryUrls: string[] = [];
    (data.images || []).forEach((item: any) => {
      if (typeof item === 'string') {
        existingGalleryUrls.push(item);
      } else if (item instanceof File) {
        formData.append('images', item);
      }
    });
    formData.append('images', JSON.stringify(existingGalleryUrls));

    // Variants Handling
    const variantsData: any[] = [];
    (data.variants || []).forEach((variant, vIdx) => {
      const variantObj = {
        color: variant.color,
        sizes: (variant.sizes || []).map((s) => ({
          size: s.size,
          stock: Number(s.stock) || 0,
        })),
        images: [] as string[],
        sku: variant.sku,
      };

      (variant.images || []).forEach((img: any) => {
        if (typeof img === 'string') {
          variantObj.images.push(img);
        } else if (img instanceof File) {
          formData.append(`variants[${vIdx}][images]`, img);
        }
      });
      variantsData.push(variantObj);
    });
    formData.append('variants', JSON.stringify(variantsData));

    if (isEdit && product) {
      await executePost({
        action: () => updateProduct(formData as any, product._id as string),
        success: {
          onSuccess: () => {
            router.push('/admin/products');
            router.refresh();
          },
          loadingText: 'Product updating...',
          message: 'Product updated successfully',
        },
      });
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
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main SKU</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. SKU-12345" {...field} />
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
                  <Input
                    type="number"
                    readOnly
                    className="bg-muted cursor-not-allowed font-black text-blue-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bg-muted/5 space-y-4 rounded-xl border border-white/10 p-4">
            <FormField
              control={form.control}
              name="isOffer"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3 p-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-black tracking-widest text-blue-500 uppercase">
                      Special Offer
                    </FormLabel>
                    <FormDescription>
                      Enable this to show this product in the Offer section.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {watchedIsOffer && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="offerTag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Tag</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Tag" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pakistani dress">
                            Pakistani Dress
                          </SelectItem>
                          <SelectItem value="Eid offer">Eid Offer</SelectItem>
                          <SelectItem value="Durgapuja offer">
                            Durgapuja Offer
                          </SelectItem>
                          <SelectItem value="Winter sale">
                            Winter Sale
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
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
                  <FormDescription>
                    Auto-generated from name if left empty.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>YouTube Video URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Paste a YouTube link to show a video of this product.
                </FormDescription>
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
                <div className="flex items-center justify-between">
                  <FormLabel>Category</FormLabel>
                  <QuickAddCategory
                    onSuccess={(newCat) => {
                      setLocalCategories((prev) => [...prev, newCat]);
                      form.setValue('category', newCat.name);
                    }}
                  />
                </div>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {localCategories.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!form.watch('category')}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Sub Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subCategories.map((s) => (
                      <SelectItem key={s.title} value={s.title}>
                        {s.title}
                      </SelectItem>
                    ))}
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!form.watch('subCategory')}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {types.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
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
              <FormDescription>
                Use headings, lists, and formatting to design your product
                details page.
              </FormDescription>
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
                <div className="flex items-center justify-between">
                  <FormLabel>Product Color</FormLabel>
                  <QuickAddColor
                    onSuccess={(newColor) => {
                      setLocalColors((prev) => [...prev, newColor]);
                      form.setValue('color', newColor.name);
                    }}
                  />
                </div>
                <div className="border-border/50 bg-muted/10 flex flex-wrap gap-3 rounded-xl border p-4">
                  {localColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => field.onChange(color.name)}
                      className={cn(
                        'group relative flex flex-col items-center gap-2 transition-all',
                        field.value === color.name
                          ? 'scale-110'
                          : 'opacity-60 hover:opacity-100',
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                          field.value === color.name
                            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'border-transparent',
                        )}
                        style={{ backgroundColor: color.hex }}
                      >
                        {field.value === color.name && (
                          <Check
                            className={cn(
                              'h-5 w-5',
                              ['White', 'Beige', 'Silk White', 'Gold'].includes(
                                color.name,
                              )
                                ? 'text-black'
                                : 'text-white',
                            )}
                          />
                        )}
                      </div>
                      <span className="text-[10px] font-bold tracking-tighter uppercase">
                        {color.name}
                      </span>
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
                <div className="border-border/50 bg-muted/10 flex flex-wrap gap-2 rounded-xl border p-4">
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
                        'min-w-[3rem] rounded-lg border px-4 py-2 text-xs font-black transition-all',
                        field.value?.includes(size)
                          ? 'bg-foreground text-background border-foreground shadow-md'
                          : 'border-border/50 bg-background text-muted-foreground hover:border-foreground/30',
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
        {/* Main Product Size-wise Stock */}
        {watchedSizes.length > 0 && (
          <div className="bg-muted/10 space-y-4 rounded-2xl border border-white/10 p-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black tracking-tight uppercase">
                Main Color ({watchedColor || 'None'}) Size Stock
              </h3>
              <p className="text-muted-foreground text-[10px] font-medium">
                Set stock levels for each size of the main product color.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
              {watchedSizes.map((sizeName, sIdx) => {
                const mainSizeStock = form.watch('sizeStock') || [];
                const entryIdx = mainSizeStock.findIndex(
                  (s) => s.size === sizeName,
                );
                if (entryIdx === -1) return null;

                return (
                  <div key={sizeName} className="space-y-2">
                    <FormLabel className="text-[10px] font-bold text-slate-500 uppercase">
                      {sizeName}
                    </FormLabel>
                    <FormField
                      control={form.control}
                      name={`sizeStock.${entryIdx}.stock`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="rounded-xl border-2 font-bold"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border border-white/10 p-4 shadow-sm">
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
        <div className="border-border/50 bg-muted/20 rounded-xl border p-5">
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

        {/* Product Variants */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-black tracking-tight uppercase">
                Product Color Variants
              </h3>
              <p className="text-muted-foreground text-xs font-medium">
                Add color variants with their own dedicated image galleries
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendVariant({
                  color: '',
                  sizes: watchedSizes.map((s) => ({ size: s, stock: 0 })),
                  images: [],
                  sku: '',
                })
              }
              className="rounded-xl border-2 border-blue-500 font-black text-blue-500 hover:bg-blue-50"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Variant
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {variantFields.map((field, index) => (
              <div
                key={field.id}
                className="border-border/50 bg-background group relative rounded-2xl border-2 p-6 shadow-sm transition-all hover:border-blue-500/30"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVariant(index)}
                  className="text-muted-foreground absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                  {/* Variant Color Section */}
                  <div className="space-y-4 md:col-span-4">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.color`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                            Variant Color
                          </FormLabel>
                          <div className="grid grid-cols-4 gap-2">
                            {colors.map((color) => (
                              <button
                                key={color.name}
                                type="button"
                                onClick={() => field.onChange(color.name)}
                                title={color.name}
                                className={cn(
                                  'relative flex aspect-square items-center justify-center overflow-hidden rounded-full border-2 transition-all',
                                  field.value === color.name
                                    ? 'scale-110 border-blue-500 shadow-lg'
                                    : 'border-transparent opacity-80 hover:opacity-100',
                                )}
                              >
                                <div
                                  className="h-full w-full"
                                  style={{ backgroundColor: color.hex }}
                                />
                                {field.value === color.name && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <Check
                                      className={cn(
                                        'h-4 w-4',
                                        [
                                          'White',
                                          'Beige',
                                          'Silk White',
                                          'Gold',
                                        ].includes(color.name)
                                          ? 'text-black'
                                          : 'text-white',
                                      )}
                                    />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                          <p className="text-muted-foreground mt-2 text-center text-[10px] font-black uppercase">
                            {field.value || 'Select a color'}
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                        Size-wise Stock
                      </FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        {watchedSizes.map((sizeName) => {
                          const variantSizes =
                            form.getValues(`variants.${index}.sizes`) || [];
                          const sizeEntryIdx = variantSizes.findIndex(
                            (s) => s.size === sizeName,
                          );

                          if (sizeEntryIdx === -1) return null;

                          return (
                            <div key={sizeName} className="space-y-1">
                              <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-bold text-slate-500">
                                  {sizeName}
                                </span>
                              </div>
                              <FormField
                                control={form.control}
                                name={`variants.${index}.sizes.${sizeEntryIdx}.stock`}
                                render={({ field }) => (
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      className="h-8 rounded-lg border-2 text-xs"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                    />
                                  </FormControl>
                                )}
                              />
                            </div>
                          );
                        })}
                      </div>
                      {watchedSizes.length === 0 && (
                        <p className="text-muted-foreground text-[10px] italic">
                          Please select sizes above first.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Variant Gallery Section */}
                  <div className="md:col-span-8">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.images`}
                      render={({ field }) => (
                        <FormItem>
                          <MultiImageUploader
                            label="Variant Gallery (Max 6)"
                            value={field.value || []}
                            onChange={field.onChange}
                            max={6}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.sku`}
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                            Variant SKU
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Variant SKU"
                              className="rounded-xl border-2"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {variantFields.length === 0 && (
            <div className="border-border bg-muted/20 flex flex-col items-center justify-center space-y-3 rounded-2xl border-2 border-dashed p-12 text-center">
              <div className="bg-background text-muted-foreground flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm">
                <Plus size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold">No variants added yet</p>
                <p className="text-muted-foreground text-xs">
                  Click "Add Variant" to start adding color options
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <SubmitButton
            loading={form.formState.isSubmitting}
            text={isEdit ? 'Update Product' : 'Add Product'}
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

export default ProductForm;

'use client';

import SubmitButton from '@/components/common/button/submit-button';
import PlateRichEditor from '@/components/rich-text/core/rich-editor';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import SingleVideoUploader from '@/components/ui/single-video-uploader';
import { Textarea } from '@/components/ui/textarea';
import useActionHandler from '@/hooks/useActionHandler';
import { cn, getYoutubeEmbedUrl } from '@/lib/utils';
import type { ICategory } from '@/services/category/category.interface';
import type { IColor } from '@/services/color/color.interface';
import type { IOffer } from '@/services/offer/offer.interface';
import { createProduct, updateProduct } from '@/services/product/product';
import type { IProduct } from '@/services/product/product.interface';
import {
  addProductSchema,
  updateProductSchema,
} from '@/services/product/product.validation';
import type { ISizeGuide } from '@/services/size-guide/size-guide.interface';
import type { ISize } from '@/services/size/size.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Plus, Save, Trash2, Youtube } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import QuickAddColor from '../../colors/_componnets/QuickAddColor';
import QuickAddOffer from './QuickAddOffer';

import { IProductUpload } from '@/services/product/product.interface';

interface Props {
  product?: IProduct;
  categories: ICategory[];
  colors: IColor[];
  sizes: ISize[];
  sizeGuides: ISizeGuide[];
  offers: IOffer[];
  onSuccess?: () => void;
}

const ProductForm = ({
  product,
  categories,
  colors,
  sizes,
  sizeGuides,
  offers,
  onSuccess,
}: Props) => {
  const router = useRouter();
  const { executePost } = useActionHandler();
  const [localCategories, setLocalCategories] = useState(categories);
  const [localColors, setLocalColors] = useState(colors);
  const [localOffers, setLocalOffers] = useState(offers);
  const isEdit = !!product;
  const schema = isEdit ? updateProductSchema : addProductSchema;

  const form = useForm<IProductUpload>({
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
      color: product?.color || '',
      variants:
        product?.variants?.map((v) => ({
          ...v,
          sizes: v.sizes || [],
        })) || [],
      sizes: product?.sizes || [],
      featured: product?.featured || false,
      isOffer: product?.isOffer || false,
      isActive: product?.isActive ?? true,
      offerTag: product?.offerTag || '',
      discountPercentage: product?.discountPercentage || 0,
      sizeStock: product?.sizeStock || [],
      thumbnails: product?.thumbnails || [],
      sku: product?.sku || '',
      videoUrl: product?.videoUrl || '',
      youtubeVideoUrl: product?.youtubeVideoUrl || '',
      refundPolicy: product?.refundPolicy || '',
      returnPolicy: product?.returnPolicy || '',
      sizeGuide:
        (product?.sizeGuide as any)?._id ||
        (product?.sizeGuide as string) ||
        '',
      seo: {
        title: product?.seo?.title || '',
        description: product?.seo?.description || '',
        keywords: product?.seo?.keywords || '',
      },
    },
  });

  const [isSizeGuidePreviewOpen, setIsSizeGuidePreviewOpen] = useState(false);
  const [selectedSizeGuideImage, setSelectedSizeGuideImage] = useState<
    string | null
  >(null);
  const [showCustomRefund, setShowCustomRefund] = useState(
    !!product?.refundPolicy,
  );
  const [showCustomReturn, setShowCustomReturn] = useState(
    !!product?.returnPolicy,
  );

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
        color: product.color || '',
        variants:
          product.variants?.map((v) => ({
            ...v,
            sizes: v.sizes || [],
          })) || [],
        sizes: product.sizes || [],
        featured: product.featured || false,
        isOffer: product.isOffer || false,
        isActive: product.isActive ?? true,
        offerTag: product.offerTag || '',
        discountPercentage: product.discountPercentage || 0,
        sizeStock: product.sizeStock || [],
        thumbnails: product.thumbnails || [],
        sku: product.sku || '',
        videoUrl: product.videoUrl || '',
        sizeGuide:
          (product.sizeGuide as any)?._id ||
          (product.sizeGuide as string) ||
          '',
        seo: {
          title: product.seo?.title || '',
          description: product.seo?.description || '',
          keywords: product.seo?.keywords || '',
        },
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
    const hasSizeStock = watchedSizeStock && watchedSizeStock.length > 0;
    const hasVariants = watchedVariants && watchedVariants.length > 0;

    if (hasSizeStock || hasVariants) {
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
    }
  }, [watchedSizeStock, watchedVariants, form]);

  const subCategories = selectedCategory?.subCategories || [];
  const selectedSubCategory = subCategories.find(
    (s) => s.title === form.watch('subCategory'),
  );
  const types = selectedSubCategory?.items || [];

  const onSubmit = async (data: IProductUpload) => {
    // ── Step 1: Upload all images/videos directly from browser → Cloudflare R2 ──
    const { uploadManyToR2, uploadToR2 } = await import('@/lib/r2-upload');

    // Video — upload if it's a new File
    let finalVideoUrl = typeof data.videoUrl === 'string' ? data.videoUrl : '';
    let finalYoutubeUrl = data.youtubeVideoUrl || '';

    if (data.videoUrl instanceof File) {
      finalVideoUrl = await uploadToR2(data.videoUrl, 'products/videos');
    }

    // Gallery thumbnails — upload new Files in parallel, keep existing URLs
    const galleryFiles: File[] = [];
    const galleryExistingUrls: string[] = [];
    (data.thumbnails || []).forEach((item: any) => {
      if (typeof item === 'string') galleryExistingUrls.push(item);
      else if (item instanceof File) galleryFiles.push(item);
    });
    const newGalleryUrls =
      galleryFiles.length > 0
        ? await uploadManyToR2(galleryFiles, 'products')
        : [];
    const allGalleryUrls = [...galleryExistingUrls, ...newGalleryUrls];

    // Variant thumbnails — upload new Files per variant concurrently
    const variantFileMap: { vIdx: number; files: File[] }[] = [];
    (data.variants || []).forEach((variant, vIdx) => {
      const files: File[] = (variant.thumbnails || []).filter(
        (img: any) => img instanceof File,
      ) as File[];
      if (files.length > 0) variantFileMap.push({ vIdx, files });
    });
    const variantUploadResults = await Promise.all(
      variantFileMap.map(async ({ vIdx, files }) => ({
        vIdx,
        urls: await uploadManyToR2(files, 'products'),
      })),
    );
    const variantNewUrlsMap = new Map(
      variantUploadResults.map(({ vIdx, urls }) => [vIdx, urls]),
    );

    // Build variants with resolved URLs only (no File objects)
    const variantsData: any[] = (data.variants || []).map((variant, vIdx) => {
      const existingUrls = (variant.thumbnails || []).filter(
        (img: any) => typeof img === 'string',
      ) as string[];
      return {
        color: variant.color,
        sizes: (variant.sizes || []).map((s) => ({
          size: s.size,
          stock: Number(s.stock) || 0,
        })),
        thumbnails: [...existingUrls, ...(variantNewUrlsMap.get(vIdx) || [])],
        sku: variant.sku,
      };
    });

    // ── Step 2: Build FormData with URLs only (no File objects) ───────────
    let totalStock = 0;
    const hasSizeStockData = data.sizeStock && data.sizeStock.length > 0;
    const hasVariantsData = data.variants && data.variants.length > 0;

    if (hasSizeStockData || hasVariantsData) {
      (data.sizeStock || []).forEach((s) => {
        totalStock += Number(s.stock) || 0;
      });
      (data.variants || []).forEach((v) => {
        (v.sizes || []).forEach((s) => {
          totalStock += Number(s.stock) || 0;
        });
      });
    } else {
      totalStock = Number(data.stock) || 0;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', String(data.price));
    formData.append('buyPrice', String(data.buyPrice));
    formData.append('stock', String(totalStock));
    formData.append('salePrice', String(data.salePrice));
    formData.append('description', data.description);
    formData.append('category', data.category);
    if (data.subCategory) formData.append('subCategory', data.subCategory);
    if (data.type) formData.append('type', data.type);
    formData.append('slug', data.slug || '');
    formData.append('featured', String(data.featured));
    formData.append('isOffer', String(data.isOffer));
    formData.append('isActive', String(data.isActive));
    formData.append('offerTag', data.offerTag || '');
    formData.append('discountPercentage', String(data.discountPercentage));
    formData.append('videoUrl', finalVideoUrl);
    formData.append('youtubeVideoUrl', finalYoutubeUrl);
    formData.append('refundPolicy', data.refundPolicy || '');
    formData.append('returnPolicy', data.returnPolicy || '');
    formData.append(
      'sizeGuide',
      data.sizeGuide === 'none' ? '' : data.sizeGuide || '',
    );
    formData.append('seo', JSON.stringify(data.seo || {}));
    formData.append('color', data.color);
    formData.append('sizes', JSON.stringify(data.sizes || []));
    formData.append('sku', data.sku || '');
    formData.append(
      'sizeStock',
      JSON.stringify(
        (data.sizeStock || []).map((s) => ({
          size: s.size,
          stock: Number(s.stock) || 0,
        })),
      ),
    );
    formData.append('thumbnails', JSON.stringify(allGalleryUrls));
    formData.append('variants', JSON.stringify(variantsData));

    // ── Step 3: Send to Express (URLs only — fast, no files) ──────────────
    if (isEdit && product) {
      await executePost({
        action: () => updateProduct(formData as any, product._id as string),
        success: {
          onSuccess: () => {
            // Force a hard navigation to guarantee the table gets fresh data
            window.location.href = '/admin/products';
            onSuccess?.();
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
            onSuccess?.();
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-bold tracking-widest text-blue-600 uppercase">
                Product Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Premium Silk Pakistani Suit"
                  className="text-lg font-bold"
                  {...field}
                />
              </FormControl>
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
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
                <FormLabel>
                  Buy Price (৳) <span className="text-red-500">*</span>
                </FormLabel>
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
                <FormLabel>
                  Sale Price (৳) <span className="text-red-500">*</span>
                </FormLabel>
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
                <FormLabel>Discount (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 20"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const percentage = Number(e.target.value);
                      const price = Number(form.getValues('price'));
                      if (price > 0) {
                        if (percentage > 0 && percentage < 100) {
                          const salePrice = Math.round(
                            price - (price * percentage) / 100,
                          );
                          form.setValue('salePrice', salePrice);
                        } else if (percentage === 0) {
                          form.setValue('salePrice', 0);
                        }
                      }
                    }}
                  />
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
                <FormLabel>Discounted Price (৳)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const salePrice = Number(e.target.value);
                      const price = Number(form.getValues('price'));
                      if (price > 0) {
                        if (salePrice > 0 && salePrice < price) {
                          const percentage = Math.round(
                            ((price - salePrice) / price) * 100,
                          );
                          form.setValue('discountPercentage', percentage);
                        } else if (salePrice === 0 || salePrice >= price) {
                          form.setValue('discountPercentage', 0);
                        }
                      }
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {/* Stock is entirely auto-calculated and hidden from UI as per request */}
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
                      <div className="flex items-center gap-2">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select Tag" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {localOffers.map((o) => (
                              <SelectItem key={o._id} value={o.tag}>
                                {o.name} ({o.tag})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <QuickAddOffer
                          onSuccess={(newOffer) => {
                            setLocalOffers((prev) => [...prev, newOffer]);
                            form.setValue('offerTag', newOffer.tag);
                            if (!form.watch('discountPercentage')) {
                              form.setValue(
                                'discountPercentage',
                                newOffer.discountPercentage,
                              );
                              // Auto update salePrice too
                              const price = Number(form.getValues('price'));
                              if (
                                price > 0 &&
                                newOffer.discountPercentage > 0
                              ) {
                                form.setValue(
                                  'salePrice',
                                  Math.round(
                                    price -
                                      (price * newOffer.discountPercentage) /
                                        100,
                                  ),
                                );
                              }
                            }
                          }}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="sizeGuide"
            render={({ field }) => {
              const selectedSg = sizeGuides.find(
                (sg) => sg._id === field.value,
              );
              return (
                <FormItem>
                  <FormLabel>Size Guide</FormLabel>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Size Guide" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {sizeGuides.map((sg) => (
                            <SelectItem key={sg._id} value={sg._id}>
                              {sg.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select a size guide to display inline on the product
                        details page. <br />
                        <span className="font-bold text-blue-500">
                          Tip:
                        </span>{' '}
                        For the best visual appearance, ensure the uploaded size
                        guide image has a clean white or transparent background
                        and clear typography.
                      </FormDescription>
                    </div>

                    {selectedSg?.image && (
                      <div
                        className="bg-muted border-border/50 group relative h-20 w-20 shrink-0 cursor-zoom-in overflow-hidden rounded-xl border transition-all duration-300 hover:scale-105"
                        onClick={() => {
                          setSelectedSizeGuideImage(selectedSg.image);
                          setIsSizeGuidePreviewOpen(true);
                        }}
                      >
                        <Image
                          src={selectedSg.image}
                          alt="Size Guide Preview"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <Plus className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <div className="flex h-9 items-center">
                  <FormLabel>
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
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
                <div className="flex h-9 items-center">
                  <FormLabel>Sub Category</FormLabel>
                </div>
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
                    {subCategories.map((s, idx) => (
                      <SelectItem
                        key={s.title || `sub-${idx}`}
                        value={s.title || ''}
                      >
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
                <div className="flex h-9 items-center">
                  <FormLabel>Type</FormLabel>
                </div>
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

        {/* Main Product Layout: Color & Sizes (Left) | Gallery (Right) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Left Side: Color & Sizes */}
          <div className="space-y-6 md:col-span-4">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <div className="flex h-9 items-center justify-between">
                    <FormLabel className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                      Product Color <span className="text-red-500">*</span>
                    </FormLabel>
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
                          )}
                        </div>
                        <span className="text-[10px] font-bold tracking-tighter uppercase">
                          {color.name}
                        </span>
                      </button>
                    ))}
                    <QuickAddColor
                      customTrigger={
                        <button
                          type="button"
                          className="group relative flex flex-col items-center gap-2 opacity-60 transition-all hover:opacity-100"
                        >
                          <div className="border-muted-foreground/50 group-hover:border-foreground/50 flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed bg-transparent transition-all">
                            <Plus className="text-muted-foreground group-hover:text-foreground h-5 w-5 transition-all" />
                          </div>
                          <span className="text-muted-foreground group-hover:text-foreground text-[10px] font-bold tracking-tighter uppercase">
                            New
                          </span>
                        </button>
                      }
                      onSuccess={(newColor) => {
                        setLocalColors((prev) => [...prev, newColor]);
                        form.setValue('color', newColor.name);
                      }}
                    />
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
                  <div className="flex h-9 items-center">
                    <FormLabel className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                      Available Sizes <span className="text-red-500">*</span>
                    </FormLabel>
                  </div>
                  <div className="border-border/50 bg-muted/10 flex flex-wrap items-center gap-2 rounded-xl border p-4">
                    {sizes.map((size) => (
                      <button
                        key={size._id}
                        type="button"
                        onClick={() => {
                          const current = field.value || [];
                          const updated = current.includes(size.name)
                            ? current.filter((s: string) => s !== size.name)
                            : [...current, size.name];
                          field.onChange(updated);
                        }}
                        className={cn(
                          'flex h-10 min-w-[3rem] cursor-pointer items-center justify-center rounded-lg border px-4 text-xs font-black transition-all',
                          field.value?.includes(size.name)
                            ? 'bg-foreground text-background border-foreground shadow-md'
                            : 'border-border/50 bg-background text-muted-foreground hover:border-foreground/30',
                        )}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right Side: Gallery Images */}
          <div className="md:col-span-8">
            <FormField
              control={form.control}
              name="thumbnails"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiImageUploader
                      label="Main Gallery Images"
                      value={field.value}
                      max={6}
                      required={true}
                      onChange={(files) => field.onChange(files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="youtubeVideoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>YouTube Video URL</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      {...field}
                    />
                    {field.value && getYoutubeEmbedUrl(field.value) ? (
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black">
                        <iframe
                          width="100%"
                          height="100%"
                          src={getYoutubeEmbedUrl(field.value)}
                          title="Product Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          referrerPolicy="origin"
                          className="absolute inset-0 h-full w-full"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 z-10"
                          onClick={() => field.onChange('')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-muted bg-muted/20 relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed">
                        <div className="text-muted-foreground flex flex-col items-center justify-center space-y-2 opacity-50">
                          <Youtube className="h-10 w-10" />
                          <p className="text-sm font-medium">
                            No YouTube Video
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Paste a YouTube link to show a video of this product in the
                  tabs section.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2"></FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {/* Dummy spacer to align perfectly with the YouTube Input field on the left */}
                    <div className="h-10 w-full rounded-md border border-transparent" />
                    <SingleVideoUploader
                      onChange={field.onChange}
                      defaultValue={
                        typeof field.value === 'string' ? field.value : ''
                      }
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload an MP4 or WebM video to show in a floating modal on
                  desktop.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border border-white/10 p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-black tracking-widest text-emerald-500 uppercase">
                  Active Status
                </FormLabel>
                <FormDescription>
                  Enable to show this product on the public store.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

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
              size="sm"
              onClick={() =>
                appendVariant({
                  color: '',
                  sizes: watchedSizes.map((s) => ({ size: s, stock: 0 })),
                  thumbnails: [],
                  sku: '',
                })
              }
              className="rounded-xl bg-blue-600 font-black text-white shadow-md transition-all hover:bg-blue-700"
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
                            Variant Color{' '}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="flex flex-wrap gap-3">
                            {colors.map((color) => (
                              <button
                                key={color.name}
                                type="button"
                                onClick={() => field.onChange(color.name)}
                                title={color.name}
                                className={cn(
                                  'group relative flex flex-col items-center justify-center gap-2 transition-all',
                                  field.value === color.name
                                    ? 'scale-110'
                                    : 'opacity-60 hover:scale-105 hover:opacity-100',
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
                                  )}
                                </div>
                                <span className="text-[10px] font-bold tracking-tighter uppercase">
                                  {color.name}
                                </span>
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

                    {/* Variant Sizes Selector */}
                    <div className="space-y-4">
                      <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                        Variant Sizes <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="border-border/50 bg-muted/10 flex flex-wrap items-center gap-2 rounded-xl border p-4">
                        {sizes.map((size) => {
                          const variantSizes =
                            form.watch(`variants.${index}.sizes`) || [];
                          const isSelected = variantSizes.some(
                            (s: { size: string }) => s.size === size.name,
                          );

                          return (
                            <button
                              key={size._id}
                              type="button"
                              onClick={() => {
                                const current = [...variantSizes];
                                const existingIdx = current.findIndex(
                                  (s: { size: string }) => s.size === size.name,
                                );
                                if (existingIdx >= 0) {
                                  current.splice(existingIdx, 1);
                                } else {
                                  current.push({ size: size.name, stock: 0 });
                                }
                                form.setValue(
                                  `variants.${index}.sizes`,
                                  current,
                                  {
                                    shouldValidate: true,
                                  },
                                );
                              }}
                              className={cn(
                                'flex h-10 min-w-[3rem] cursor-pointer items-center justify-center rounded-lg border px-4 text-xs font-black transition-all',
                                isSelected
                                  ? 'bg-foreground text-background border-foreground shadow-md'
                                  : 'border-border/50 bg-background text-muted-foreground hover:border-foreground/30',
                              )}
                            >
                              {size.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <FormLabel className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                        Size-wise Stock
                      </FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        {(form.watch(`variants.${index}.sizes`) || []).map(
                          (sizeObj: { size: string }, sizeEntryIdx: number) => {
                            const sizeName = sizeObj.size;

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
                          },
                        )}
                      </div>
                      {(form.watch(`variants.${index}.sizes`) || []).length ===
                        0 && (
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
                      name={`variants.${index}.thumbnails`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <MultiImageUploader
                              label="Variant Gallery Images"
                              value={field.value}
                              max={6}
                              onChange={(files) => field.onChange(files)}
                            />
                          </FormControl>
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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <PlateRichEditor
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                <span className="font-bold text-blue-500">Note:</span> This
                content will be displayed in the Description tab on the product
                page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-muted/5 space-y-6 rounded-xl border border-white/10 p-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black tracking-tight uppercase">
              Policies (Optional)
            </h3>
            <p className="text-muted-foreground text-xs font-medium">
              Override the global refund and return policies for this specific
              product.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-card flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow-sm">
                <FormControl>
                  <Checkbox
                    checked={showCustomRefund}
                    onCheckedChange={(checked) => {
                      setShowCustomRefund(!!checked);
                      if (!checked) form.setValue('refundPolicy', '');
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Enable Custom Refund Policy</FormLabel>
                  <FormDescription>
                    Checking this will allow you to write a refund policy
                    specific to this product.
                  </FormDescription>
                </div>
              </div>

              {showCustomRefund && (
                <FormField
                  control={form.control}
                  name="refundPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="border-input bg-card min-h-[200px] rounded-xl border">
                          <PlateRichEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-card flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow-sm">
                <FormControl>
                  <Checkbox
                    checked={showCustomReturn}
                    onCheckedChange={(checked) => {
                      setShowCustomReturn(!!checked);
                      if (!checked) form.setValue('returnPolicy', '');
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Enable Custom Return Policy</FormLabel>
                  <FormDescription>
                    Checking this will allow you to write a return policy
                    specific to this product.
                  </FormDescription>
                </div>
              </div>

              {showCustomReturn && (
                <FormField
                  control={form.control}
                  name="returnPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="border-input bg-card min-h-[200px] rounded-xl border">
                          <PlateRichEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        </div>

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
                    placeholder="e.g. Premium Silk Pakistani Suit | Aranis"
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
                    placeholder="e.g. silk suit, pakistani dress, luxury fashion"
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
                    placeholder="A brief description of this product for search engines..."
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

      {/* Size Guide Image Preview Modal */}
      <Dialog
        open={isSizeGuidePreviewOpen}
        onOpenChange={setIsSizeGuidePreviewOpen}
      >
        <DialogContent className="border-none bg-transparent p-0 shadow-none sm:max-w-[800px]">
          <DialogHeader className="sr-only">
            <DialogTitle>Size Guide Preview</DialogTitle>
          </DialogHeader>
          <div className="relative flex h-full w-full items-center justify-center overflow-auto">
            {selectedSizeGuideImage && (
              <img
                src={selectedSizeGuideImage}
                alt="Size Guide Full Preview"
                className="max-h-[90vh] max-w-none min-w-[600px] rounded-xl object-contain shadow-2xl md:min-w-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default ProductForm;

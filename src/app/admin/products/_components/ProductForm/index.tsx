'use client';

import SubmitButton from '@/components/common/button/submit-button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import useActionHandler from '@/hooks/useActionHandler';
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
import { Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { IProductUpload } from '@/services/product/product.interface';
import ProductGeneralInfo from './ProductGeneralInfo';
import ProductMedia from './ProductMedia';
import ProductPricing from './ProductPricing';
import ProductSettings from './ProductSettings';
import ProductVariants from './ProductVariants';

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

  const watchedSizes = form.watch('sizes');
  const watchedSizeStock = form.watch('sizeStock');
  const watchedVariants = form.watch('variants');

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
        <ProductGeneralInfo
          localCategories={localCategories}
          setLocalCategories={setLocalCategories}
        />

        <ProductPricing />

        <ProductVariants
          localColors={localColors}
          setLocalColors={setLocalColors}
          sizes={sizes}
        />

        <ProductMedia />

        <ProductSettings
          sizeGuides={sizeGuides}
          localOffers={localOffers}
          setLocalOffers={setLocalOffers}
          setSelectedSizeGuideImage={setSelectedSizeGuideImage}
          setIsSizeGuidePreviewOpen={setIsSizeGuidePreviewOpen}
        />

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

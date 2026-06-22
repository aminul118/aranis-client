'use client';

import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useWishlist } from '@/context/WishlistContext';
import type { IProduct } from '@/services/product/product.interface';
import { createRestockRequest } from '@/services/restock/restock';
import type { ISiteSetting } from '@/services/settings/settings.interface';
import { IVariantSize } from '@/types';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ProductDetailActions from './ProductDetailActions';
import ProductDetailHeader from './ProductDetailHeader';
import ProductDetailMobileSections from './ProductDetailMobileSections';
import ProductDetailSizes from './ProductDetailSizes';
import ProductDetailTabs from './ProductDetailTabs';
import ProductDetailVariants from './ProductDetailVariants';
import ProductImageGallery from './ProductImageGallery';

const ProductVideoModal = dynamic(() => import('./ProductVideoModal'), {
  ssr: false,
});

import { getYoutubeEmbedUrl } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
interface ProductDetailContentProps {
  product: IProduct;
  settings?: ISiteSetting;
  urlColor?: string;
}

const ProductDetailContent = ({
  product,
  settings,
  urlColor,
}: ProductDetailContentProps) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useUser();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(-1);

  // Initialize variant from URL color
  useEffect(() => {
    if (urlColor && product.variants) {
      const sColor = urlColor.toLowerCase();
      const idx = product.variants.findIndex((v) => {
        const vColor = v.color?.toLowerCase();
        return vColor
          ? vColor === sColor ||
              vColor.includes(sColor) ||
              sColor.includes(vColor)
          : false;
      });
      if (idx !== -1) {
        setSelectedVariantIndex(idx);
      }
    }
  }, [urlColor, product.variants]);
  const [isRequesting, setIsRequesting] = useState(false);
  const currentSelectedColor =
    (selectedVariantIndex === -1
      ? product.color
      : product.variants?.[selectedVariantIndex]?.color) || '';
  const isWishlisted = isInWishlist(
    product._id as string,
    currentSelectedColor,
    selectedSize,
  );

  // Auto-select available size when variant changes
  useEffect(() => {
    const getStockForSize = (size: string) => {
      if (selectedVariantIndex >= 0) {
        const variant = product.variants?.[selectedVariantIndex];
        return (
          variant?.sizes?.find((s: IVariantSize) => s.size === size)?.stock || 0
        );
      }
      return (
        product.sizeStock?.find((s: IVariantSize) => s.size === size)?.stock ||
        0
      );
    };

    if (getStockForSize(selectedSize) === 0) {
      const availableSizes = product.sizes.filter(
        (s: string) => getStockForSize(s) > 0,
      );
      if (availableSizes.length > 0) {
        setSelectedSize(availableSizes[0]);
      }
    }
  }, [selectedVariantIndex, product.variants, product.sizeStock]);

  const handleRestockRequest = async () => {
    if (!user) {
      toast.error('Authentication Required', {
        description:
          'Please login to request a restock. We will notify you via email.',
        action: {
          label: 'Login',
          onClick: () => router.push('/login'),
        },
      });
      return;
    }

    try {
      setIsRequesting(true);
      const res = await createRestockRequest(product._id as string);
      if (res.success) {
        toast.success('Restock request submitted!', {
          description:
            "We'll notify you as soon as this item is back in stock.",
        });
      } else {
        toast.error(res.message || 'Failed to submit restock request');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleAddToCart = (shouldRedirect = false) => {
    // Determine which color to add (selected variant or default)
    const selectedColor =
      selectedVariantIndex === -1
        ? product.color
        : product.variants?.[selectedVariantIndex].color;

    addToCart(product, selectedColor, selectedSize);

    if (shouldRedirect) {
      router.push('/checkout');
    } else {
      toast.success(`${product.name} (${selectedColor}) added to cart!`, {
        description: 'Check your cart to proceed to checkout.',
        icon: <ShoppingCart className="h-4 w-4 text-blue-500" />,
      });
    }
  };

  // Build the image list based on selected variant
  const currentVariant =
    selectedVariantIndex >= 0 ? product.variants?.[selectedVariantIndex] : null;

  const allImages = (
    currentVariant
      ? (currentVariant.thumbnails || []).slice(0, 6)
      : (product.thumbnails || []).slice(0, 6)
  )
    .filter(
      (img) => img && typeof img === 'string' && img !== '[]' && img !== '',
    )
    .map((img) =>
      (img as string).startsWith('/') || (img as string).startsWith('http')
        ? img
        : '/placeholder.jpg',
    );

  // Stock for product (Size-aware)
  const currentStock = (() => {
    if (selectedVariantIndex >= 0) {
      const variant = product.variants?.[selectedVariantIndex];
      const sizeObj = variant?.sizes?.find(
        (s: IVariantSize) => s.size === selectedSize,
      );
      return sizeObj ? sizeObj.stock : 0;
    } else {
      // Main product
      const sizeObj = product.sizeStock?.find(
        (s: IVariantSize) => s.size === selectedSize,
      );
      return sizeObj ? sizeObj.stock : product.stock; // Fallback to global stock if sizeStock not set
    }
  })();

  const handleShare = (platform: 'facebook' | 'messenger' | 'copy') => {
    if (typeof window === 'undefined') return;

    const url = window.location.href;
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      messenger: `fb-messenger://share/?link=${encodeURIComponent(url)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
      return;
    }

    if (
      platform === 'messenger' &&
      !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    ) {
      toast.info('Messenger sharing is best on mobile. Link copied instead!');
      navigator.clipboard.writeText(url);
      return;
    }

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  return (
    <div className="flex flex-col gap-16 lg:gap-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
        {/* Image Section */}
        <div className="space-y-12 lg:col-span-5">
          <ProductImageGallery
            key={selectedVariantIndex} // Force re-render of gallery when variant changes
            thumbnails={allImages}
            productName={product.name}
            saleBadge={
              (product.salePrice ?? 0) > 0 ? (
                <Badge className="rounded-full border-none bg-red-600 px-4 py-1.5 text-sm font-black text-white shadow-xl shadow-red-500/30">
                  {Math.round(
                    (1 - (product.salePrice ?? 0) / product.price) * 100,
                  )}
                  % OFF
                </Badge>
              ) : undefined
            }
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col pt-4 lg:col-span-7">
          <div className="space-y-8">
            <ProductDetailHeader
              product={product}
              currentVariant={currentVariant}
              isWishlisted={isWishlisted}
              toggleWishlist={toggleWishlist}
              handleShare={handleShare}
              currentSelectedColor={currentSelectedColor}
              selectedSize={selectedSize}
            />

            <div className="space-y-10">
              <ProductDetailVariants
                product={product}
                selectedVariantIndex={selectedVariantIndex}
                setSelectedVariantIndex={setSelectedVariantIndex}
              />

              <ProductDetailSizes
                product={product}
                selectedVariantIndex={selectedVariantIndex}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />
            </div>

            <ProductDetailActions
              currentStock={currentStock}
              isRequesting={isRequesting}
              handleRestockRequest={handleRestockRequest}
              handleAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </div>

      <div className="hidden w-full lg:block">
        <ProductDetailTabs
          product={product}
          settings={settings}
          getYoutubeEmbedUrl={getYoutubeEmbedUrl}
        />
      </div>

      <div className="w-full lg:hidden">
        <ProductDetailMobileSections
          product={product}
          settings={settings}
          getYoutubeEmbedUrl={getYoutubeEmbedUrl}
        />
      </div>

      <div className="block">
        {!!product.videoUrl && (
          <ProductVideoModal videoUrl={product.videoUrl} />
        )}
      </div>
    </div>
  );
};

export default ProductDetailContent;

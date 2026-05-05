'use client';

import HtmlContent from '@/components/rich-text/core/html-content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';
import { IProduct, IVariantSize } from '@/services/product/product';
import { createRestockRequest } from '@/services/restock/restock';
import { motion } from 'framer-motion';
import {
  BellRing,
  Check,
  Copy,
  Facebook,
  Heart,
  MessageCircle,
  Share2,
  ShoppingCart,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ProductImageGallery from './ProductImageGallery';
import ReviewSection from './Reviews/ReviewSection';

interface ProductDetailContentProps {
  product: IProduct;
}

import { useUser } from '@/context/UserContext';

const ProductDetailContent = ({ product }: ProductDetailContentProps) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useUser();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const isWishlisted = isInWishlist(product._id as string);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(-1);
  const [isRequesting, setIsRequesting] = useState(false);

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
    try {
      setIsRequesting(true);
      const res = await createRestockRequest(product._id as string);
      if (res.success) {
        toast.success('Restock request submitted!', {
          description:
            "We'll notify you as soon as this item is back in stock.",
        });
      }
    } catch (error) {
      toast.error('Please login to request restock');
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

  const allImages = currentVariant
    ? (currentVariant.images || []).slice(0, 6)
    : (Array.from(new Set([product.image, ...(product.images || [])])).filter(
        Boolean,
      ) as string[]);

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
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
      {/* Image Section */}
      <div className="space-y-12 lg:col-span-5">
        <ProductImageGallery
          key={selectedVariantIndex} // Force re-render of gallery when variant changes
          images={allImages}
          productName={product.name}
          saleBadge={
            product.salePrice && product.salePrice > 0 ? (
              <Badge className="rounded-full border-none bg-red-500 px-4 py-1.5 text-sm font-black text-white shadow-xl shadow-red-500/30">
                {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
              </Badge>
            ) : undefined
          }
        />

        {/* Artisanal Details Section - Moved here */}
        {product.details && (
          <div className="border-border/50 hidden border-t pt-8 lg:block">
            <h3 className="text-foreground mb-4 text-xs font-black tracking-[0.2em] uppercase">
              Artisanal Details
            </h3>
            <HtmlContent
              content={
                Array.isArray(product.details)
                  ? product.details.join('\n')
                  : product.details
              }
              className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none leading-relaxed font-medium"
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col pt-4 lg:col-span-7">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Brand & Stats */}
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="rounded-full border-blue-500/30 px-4 py-1 text-xs font-bold tracking-widest text-blue-500 uppercase"
            >
              Premium {product.category}
            </Badge>
            <div className="flex items-center gap-4">
              {user && (
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`border-border/50 hover:bg-muted rounded-full border p-2.5 transition-all ${isWishlisted ? 'bg-red-50 text-red-500' : 'text-muted-foreground'}`}
                >
                  <Heart
                    size={20}
                    fill={isWishlisted ? 'currentColor' : 'none'}
                  />
                </button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="border-border/50 text-muted-foreground hover:bg-muted rounded-full border p-2.5 transition-all outline-none">
                    <Share2 size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border-border bg-card w-56 rounded-2xl p-2 shadow-2xl"
                >
                  <DropdownMenuItem
                    onClick={() => handleShare('facebook')}
                    className="flex cursor-pointer items-center gap-3 rounded-xl p-3 focus:bg-blue-500/10 focus:text-blue-600"
                  >
                    <Facebook size={18} />
                    <span className="font-bold">Share on Facebook</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleShare('messenger')}
                    className="flex cursor-pointer items-center gap-3 rounded-xl p-3 focus:bg-blue-500/10 focus:text-blue-600"
                  >
                    <MessageCircle size={18} />
                    <span className="font-bold">Send in Messenger</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleShare('copy')}
                    className="focus:bg-muted flex cursor-pointer items-center gap-3 rounded-xl p-3"
                  >
                    <Copy size={18} />
                    <span className="font-bold">Copy Product Link</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Title & Price */}
          <div>
            <h1 className="text-foreground mb-6 text-4xl leading-[1.1] font-black tracking-tight capitalize md:text-5xl lg:text-6xl">
              {product.name}
            </h1>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={
                      i < Math.floor(product.rating) ? 'currentColor' : 'none'
                    }
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm font-bold">
                ({product.rating} Rating)
              </span>
            </div>

            <div className="flex items-center gap-6">
              {product.salePrice && product.salePrice > 0 ? (
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black tracking-tighter text-blue-500">
                    ৳{product.salePrice.toFixed(2)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground/40 text-xl font-medium italic line-through">
                      ৳{product.price.toFixed(2)}
                    </span>
                    <span className="w-fit rounded-full bg-red-500/10 px-3 py-1 text-xs font-black text-red-600 uppercase">
                      {Math.round(
                        (1 - product.salePrice / product.price) * 100,
                      )}
                      % OFF
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-foreground text-5xl font-black tracking-tighter">
                  ৳{product.price.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-xs font-black tracking-widest uppercase">
              SKU:
            </span>
            <span className="text-foreground text-sm font-bold tracking-tight">
              {currentVariant?.sku || product.sku || 'N/A'}
            </span>
          </div>

          <div className="from-border/50 via-border h-px bg-linear-to-r to-transparent" />

          {/* Selection Controls */}
          <div className="space-y-10">
            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-foreground text-sm font-black tracking-[0.2em] uppercase">
                    Select Color
                  </h3>
                  <Badge
                    variant="secondary"
                    className="rounded-lg px-3 py-1 text-[10px] font-black tracking-tighter uppercase"
                  >
                    {selectedVariantIndex === -1
                      ? product.color
                      : product.variants[selectedVariantIndex].color}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4">
                  {/* Default/Main Product Variant */}
                  <button
                    onClick={() => setSelectedVariantIndex(-1)}
                    className={cn(
                      'group relative h-24 w-20 overflow-hidden rounded-2xl border-2 transition-all duration-500',
                      selectedVariantIndex === -1
                        ? 'z-10 scale-110 border-blue-500 shadow-2xl shadow-blue-500/20'
                        : 'border-border/40 opacity-70 hover:scale-105 hover:border-blue-500/30 hover:opacity-100',
                    )}
                  >
                    <Image
                      src={product.image}
                      alt={product.color}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className={cn(
                        'absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500',
                        selectedVariantIndex === -1
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100',
                      )}
                    />
                    <span className="absolute inset-x-0 bottom-2 text-center text-[9px] font-black tracking-tighter text-white uppercase drop-shadow-md">
                      {product.color}
                    </span>
                    {selectedVariantIndex === -1 && (
                      <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 shadow-lg">
                        <Check
                          className="h-2.5 w-2.5 text-white"
                          strokeWidth={4}
                        />
                      </div>
                    )}
                  </button>

                  {/* Other Variants */}
                  {product.variants.map((variant, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={cn(
                        'group relative h-24 w-20 overflow-hidden rounded-2xl border-2 transition-all duration-500',
                        selectedVariantIndex === idx
                          ? 'z-10 scale-110 border-blue-500 shadow-2xl shadow-blue-500/20'
                          : 'border-border/40 opacity-70 hover:scale-105 hover:border-blue-500/30 hover:opacity-100',
                      )}
                    >
                      <Image
                        src={variant.images?.[0] || product.image}
                        alt={variant.color}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div
                        className={cn(
                          'absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500',
                          selectedVariantIndex === idx
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100',
                        )}
                      />
                      <span className="absolute inset-x-0 bottom-2 text-center text-[9px] font-black tracking-tighter text-white uppercase drop-shadow-md">
                        {variant.color}
                      </span>
                      {selectedVariantIndex === idx && (
                        <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 shadow-lg">
                          <Check
                            className="h-2.5 w-2.5 text-white"
                            strokeWidth={4}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground text-sm font-black tracking-widest uppercase">
                  Select Size
                </h3>
                <button className="text-xs font-bold text-blue-500 hover:underline">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => {
                  const sizeStock = (() => {
                    if (selectedVariantIndex >= 0) {
                      const variant = product.variants?.[selectedVariantIndex];
                      const sizeObj = variant?.sizes?.find(
                        (s: IVariantSize) => s.size === size,
                      );
                      return sizeObj ? sizeObj.stock : 0;
                    } else {
                      const sizeObj = product.sizeStock?.find(
                        (s: IVariantSize) => s.size === size,
                      );
                      return sizeObj ? sizeObj.stock : 0;
                    }
                  })();

                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={sizeStock === 0}
                      className={cn(
                        'group relative flex min-w-16 flex-col items-center justify-center gap-0.5 rounded-2xl border-2 px-5 py-3 transition-all duration-300',
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-500/20'
                          : sizeStock === 0
                            ? 'border-border/30 bg-muted/20 cursor-not-allowed opacity-40'
                            : 'border-border/50 bg-muted/30 text-muted-foreground hover:text-foreground hover:border-blue-500/30',
                      )}
                    >
                      <span className="text-sm font-black tracking-widest uppercase">
                        {size}
                      </span>
                      {sizeStock > 0 && (
                        <span
                          className={cn(
                            'text-[9px] font-bold tracking-tighter opacity-70 transition-all',
                            selectedSize === size
                              ? 'text-white'
                              : sizeStock < 5
                                ? 'text-red-500'
                                : 'text-muted-foreground',
                          )}
                        >
                          {sizeStock < 10
                            ? `${sizeStock} Left`
                            : `${sizeStock} In Stock`}
                        </span>
                      )}
                      {sizeStock === 0 && (
                        <span className="text-[9px] font-bold tracking-tighter text-red-500/60">
                          Sold Out
                        </span>
                      )}
                      {selectedSize === size && (
                        <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg ring-2 ring-white">
                          <Check className="h-2.5 w-2.5" strokeWidth={4} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col gap-4 pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              {currentStock < 1 ? (
                <Button
                  onClick={handleRestockRequest}
                  disabled={isRequesting}
                  size="lg"
                  className="flex-1 rounded-3xl bg-blue-600 py-8 text-xl font-black text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
                >
                  <BellRing className="mr-3 h-6 w-6" />{' '}
                  {isRequesting ? 'Requesting...' : 'Notify Me When Available'}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => handleAddToCart(false)}
                    size="lg"
                    variant="outline"
                    className="flex-1 rounded-3xl border-2 border-blue-600 py-8 text-xl font-black text-blue-600 transition-all hover:bg-blue-50 active:scale-[0.98]"
                  >
                    Add to Cart <ShoppingCart className="ml-3 h-6 w-6" />
                  </Button>
                  <Button
                    onClick={() => handleAddToCart(true)}
                    size="lg"
                    className="flex-1 rounded-3xl bg-blue-600 py-8 text-xl font-black text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
                  >
                    Buy Now
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center justify-center gap-8 py-4">
              <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-tighter uppercase">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${currentStock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                />
                {currentStock > 0
                  ? currentStock < 10
                    ? `Only ${currentStock} Left!`
                    : 'In Stock'
                  : 'Out of Stock'}
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-tighter uppercase">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                24h Shipping
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-tighter uppercase">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                30 Day Return
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-border/50 space-y-10 border-t pt-8">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="mb-8 flex w-full justify-start gap-4 overflow-x-auto rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="description"
                  className="text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-4 py-3 font-bold tracking-widest uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Description
                </TabsTrigger>
                {product.videoUrl && (
                  <TabsTrigger
                    value="video"
                    className="text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-4 py-3 font-bold tracking-widest uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Product Video
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="refund"
                  className="text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-4 py-3 font-bold tracking-widest uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Refund Policy
                </TabsTrigger>
                <TabsTrigger
                  value="return"
                  className="text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-4 py-3 font-bold tracking-widest uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Return Policy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-foreground mb-4 text-xs font-black tracking-[0.2em] uppercase">
                      The Narrative
                    </h3>
                    <HtmlContent
                      content={product.description}
                      className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium"
                    />
                  </div>

                  {/* Mobile Artisanal Details */}
                  {product.details && (
                    <div className="lg:hidden">
                      <h3 className="text-foreground mb-4 text-xs font-black tracking-[0.2em] uppercase">
                        Artisanal Details
                      </h3>
                      <HtmlContent
                        content={
                          Array.isArray(product.details)
                            ? product.details.join('\n')
                            : product.details
                        }
                        className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none leading-relaxed font-medium"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              {product.videoUrl && (
                <TabsContent value="video" className="mt-0">
                  <div className="aspect-video w-full overflow-hidden rounded-2xl border-4 border-white/10 shadow-2xl">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${product.videoUrl.split('v=')[1]?.split('&')[0] || product.videoUrl.split('/').pop()}`}
                      title="Product Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="text-muted-foreground mt-4 text-center text-sm font-medium italic">
                    Experience the elegance and movement of this piece in
                    motion.
                  </p>
                </TabsContent>
              )}

              <TabsContent value="refund" className="mt-0">
                <div className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium">
                  <p>
                    We believe in the quality of our products. If you are not
                    completely satisfied with your purchase, we offer a
                    straightforward refund policy.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li>
                      Refunds must be requested within 30 days of delivery.
                    </li>
                    <li>
                      The item must be in its original condition, unworn,
                      unwashed, with all original tags attached.
                    </li>
                    <li>
                      Refunds will be processed to the original payment method
                      within 5-7 business days after we receive the returned
                      item.
                    </li>
                    <li>
                      Shipping costs are non-refundable unless the item received
                      was damaged or incorrect.
                    </li>
                  </ul>
                  <p className="mt-4">
                    Please contact our support team at support@Aranis.com to
                    initiate a refund request.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="return" className="mt-0">
                <div className="prose prose-sm dark:prose-invert text-muted-foreground/80 max-w-none text-base leading-relaxed font-medium">
                  <p>
                    Our return process is designed to be as seamless as possible
                    for you.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li>
                      You have 30 days from the date of delivery to return your
                      item.
                    </li>
                    <li>
                      To initiate a return, please log in to your account,
                      navigate to "My Orders," and select the item you wish to
                      return.
                    </li>
                    <li>
                      You will receive a pre-paid return shipping label via
                      email.
                    </li>
                    <li>
                      Please package the item securely and drop it off at any
                      authorized shipping location.
                    </li>
                  </ul>
                  <p className="mt-4">
                    Once your return is received and inspected, we will notify
                    you of the approval or rejection of your return. Approved
                    returns will be refunded or exchanged according to your
                    preference.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>

      {/* Full Width Review Section */}
      <div className="mt-20 lg:col-span-12">
        <ReviewSection productId={product._id as string} />
      </div>
    </div>
  );
};

export default ProductDetailContent;

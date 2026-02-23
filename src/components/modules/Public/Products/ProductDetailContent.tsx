'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Heart, Share2, Check } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useState } from 'react';
import { IProduct } from '@/services/product/product';
import HtmlContent from '@/components/rich-text/core/html-content';
import ReviewSection from './Reviews/ReviewSection';

interface ProductDetailContentProps {
    product: IProduct;
}

const ProductDetailContent = ({ product }: ProductDetailContentProps) => {
    const { addToCart } = useCart();
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleAddToCart = () => {
        addToCart(product as any);
        toast.success(`${product.name} added to cart!`, {
            description: 'Check your cart to proceed to checkout.',
            icon: <ShoppingCart className="h-4 w-4 text-blue-500" />,
        });
    };

    const allImages = [product.image, ...(product.images || [])].filter(Boolean) as string[];
    const [selectedImage, setSelectedImage] = useState(allImages[0] || product.image);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Image Section */}
            <div className="lg:col-span-7 space-y-4">
                {/* Main image viewer */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden border border-border/50 bg-secondary/30 backdrop-blur-sm group"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={selectedImage}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Floating Badges */}
                    {product.salePrice && product.salePrice > 0 && (
                        <div className="absolute top-6 left-6 z-10">
                            <Badge className="bg-red-500 text-white border-none px-4 py-1.5 rounded-full text-sm font-black shadow-xl shadow-red-500/30">
                                {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                            </Badge>
                        </div>
                    )}

                    {/* Image counter */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-4 right-4 z-10 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                            {allImages.indexOf(selectedImage) + 1} / {allImages.length}
                        </div>
                    )}
                </motion.div>

                {/* Thumbnail strip — only shown when multiple images exist */}
                {allImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
                        {allImages.map((img, idx) => (
                            <button
                                key={img + idx}
                                type="button"
                                onClick={() => setSelectedImage(img)}
                                className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img
                                    ? 'border-blue-500 ring-2 ring-blue-500/30 scale-105'
                                    : 'border-border/50 hover:border-blue-500/40 opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="lg:col-span-5 flex flex-col pt-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-8"
                >
                    {/* Brand & Stats */}
                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-blue-500/30 text-blue-500 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                            Premium {product.category}
                        </Badge>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`p-2.5 rounded-full border border-border/50 transition-all hover:bg-muted ${isWishlisted ? 'text-red-500 bg-red-50' : 'text-muted-foreground'}`}
                            >
                                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>
                            <button className="p-2.5 rounded-full border border-border/50 text-muted-foreground hover:bg-muted transition-all">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Title & Price */}
                    <div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight capitalize leading-[1.1]">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-muted-foreground">({product.rating} Rating)</span>
                        </div>

                        <div className="flex items-center gap-6">
                            {product.salePrice && product.salePrice > 0 ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-5xl font-black text-blue-500 tracking-tighter">${product.salePrice.toFixed(2)}</span>
                                    <span className="text-2xl text-muted-foreground/40 line-through font-medium italic">${product.price.toFixed(2)}</span>
                                </div>
                            ) : (
                                <p className="text-5xl font-black text-foreground tracking-tighter">${product.price.toFixed(2)}</p>
                            )}
                        </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-border/50 via-border to-transparent" />

                    {/* Selection Controls */}
                    <div className="space-y-8">
                        {/* Size Selection */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-foreground font-black text-sm uppercase tracking-widest">Select Size</h3>
                                <button className="text-blue-500 text-xs font-bold hover:underline">Size Guide</button>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`min-w-[4rem] px-5 py-3 rounded-2xl border font-black transition-all duration-300 ${selectedSize === size
                                            ? 'bg-foreground text-background border-foreground shadow-lg scale-105'
                                            : 'border-border/50 bg-muted/30 text-muted-foreground hover:border-foreground/30'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div className="space-y-4">
                            <h3 className="text-foreground font-black text-sm uppercase tracking-widest">Color: <span className="text-muted-foreground">{selectedColor}</span></h3>
                            <div className="flex gap-4">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`relative w-12 h-12 rounded-full border-2 transition-all p-1 ${selectedColor === color ? 'border-blue-500 scale-110 shadow-lg' : 'border-transparent'
                                            }`}
                                    >
                                        <div
                                            className="w-full h-full rounded-full border border-border/50"
                                            style={{ backgroundColor: color.toLowerCase().replace('silk ', '') }}
                                        />
                                        {selectedColor === color && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <Check className={`h-4 w-4 ${['white', 'beige', 'silk white', 'gold'].includes(color.toLowerCase()) ? 'text-black' : 'text-white'}`} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="flex flex-col gap-4 pt-6">
                        <Button
                            onClick={handleAddToCart}
                            disabled={product.stock < 1}
                            size="lg"
                            className="w-full rounded-[1.5rem] py-8 text-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-500/30 transition-all active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
                        >
                            {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'} <ShoppingCart className="ml-3 h-6 w-6" />
                        </Button>
                        <div className="flex items-center justify-center gap-8 py-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                                <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                24h Shipping
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                30 Day Return
                            </div>
                        </div>
                    </div>

                    {/* Descriptions Section */}
                    <div className="space-y-10 pt-8 border-t border-border/50">
                        <div>
                            <h3 className="text-foreground font-black mb-4 text-xs uppercase tracking-[0.2em]">The Narrative</h3>
                            <HtmlContent
                                content={product.description}
                                className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground/80 leading-relaxed font-medium text-base"
                            />
                        </div>

                        {product.details && (
                            <div>
                                <h3 className="text-foreground font-black mb-4 text-xs uppercase tracking-[0.2em]">Artisanal Details</h3>
                                <HtmlContent
                                    content={Array.isArray(product.details) ? product.details.join('\n') : product.details}
                                    className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground/80 leading-relaxed font-medium"
                                />
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Full Width Review Section */}
            <div className="lg:col-span-12 mt-20">
                <ReviewSection productId={product._id as string} />
            </div>
        </div>
    );
};

export default ProductDetailContent;

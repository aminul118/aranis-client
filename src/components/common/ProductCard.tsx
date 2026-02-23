'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { IProduct } from '@/services/product/product';

interface ProductCardProps {
    product: IProduct;
    index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
    const { addToCart } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group h-full"
        >
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-muted border border-border mb-4 group-hover:border-blue-500/20 transition-all duration-300">
                <Link href={`/products/${product.slug || product._id}`}>
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>

                {/* Overlay with Quick Add */}
                <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                    <Button
                        onClick={() => {
                            addToCart(product as any);
                            toast.success(`${product.name} added to cart!`);
                        }}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                        Quick Add <ShoppingCart size={16} className="ml-2" />
                    </Button>
                </div>

                {/* Badge */}
                <div className="absolute top-4 left-4">
                    <span className="bg-card/90 backdrop-blur-md text-[10px] text-card-foreground font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-border">
                        {product.category}
                    </span>
                </div>

                {/* Sale Badge */}
                {product.salePrice && product.salePrice > 0 && (
                    <div className="absolute top-4 right-4">
                        <span className="bg-blue-600 text-[10px] text-white font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg">
                            Sale
                        </span>
                    </div>
                )}
            </div>

            <div className="px-2">
                <div className="flex justify-between items-start mb-1">
                    <Link href={`/products/${product.slug || product._id}`}>
                        <h3 className="text-foreground font-semibold group-hover:text-blue-500 transition-colors truncate flex-1 mr-2 capitalize">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                        <Star size={12} fill="currentColor" />
                        <span>{product.rating.toFixed(1)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {product.salePrice && product.salePrice > 0 ? (
                        <>
                            <p className="text-lg font-bold text-blue-600">${product.salePrice.toFixed(2)}</p>
                            <p className="text-sm font-medium text-muted-foreground line-through decoration-muted-foreground/50">${product.price.toFixed(2)}</p>
                        </>
                    ) : (
                        <p className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;

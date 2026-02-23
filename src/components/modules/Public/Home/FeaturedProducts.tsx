'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { getProducts, IProduct } from '@/services/product/product';

const FeaturedProducts = () => {
    const { addToCart } = useCart();
    const [featuredItems, setFeaturedItems] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await getProducts({ featured: 'true' });
                setFeaturedItems(data?.slice(0, 8) || []);
            } catch (error) {
                console.error('Failed to fetch featured products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="py-24 bg-slate-900/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <section className="py-24 bg-slate-900/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Excellence</h2>
                        <p className="text-slate-400">Our hand-picked selections for this season</p>
                    </div>
                    <Button asChild variant="link" className="text-blue-400 hover:text-blue-300 font-bold uppercase tracking-widest p-0 h-auto">
                        <Link href="/shop">View All Products</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredItems.map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group"
                        >
                            <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-slate-800 border border-white/5 mb-4 group-hover:border-blue-500/20 transition-all duration-300">
                                <Link href={`/products/${product._id}`}>
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </Link>

                                {/* Overlay with Quick Add */}
                                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                                    <Button
                                        onClick={() => {
                                            addToCart(product as any);
                                            toast.success(`${product.name} added to cart!`);
                                        }}
                                        className="bg-white text-slate-950 hover:bg-slate-100 rounded-full font-bold shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                    >
                                        Quick Add <ShoppingCart size={16} className="ml-2" />
                                    </Button>
                                </div>

                                {/* Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-slate-900/90 backdrop-blur-md text-[10px] text-white font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-white/10">
                                        {product.category}
                                    </span>
                                </div>
                            </div>

                            <div className="px-2">
                                <div className="flex justify-between items-start mb-1">
                                    <Link href={`/products/${product._id}`}>
                                        <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors truncate flex-1 mr-2 capitalize">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center gap-1 text-xs text-amber-400">
                                        <Star size={12} fill="currentColor" />
                                        <span>{product.rating}</span>
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-white">${product.price.toFixed(2)}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;

'use client';

import { useEffect, useState } from 'react';
import { getBestSellingProducts, IProduct } from '@/services/product/product';
import ProductCard from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Grid from '@/components/common/Grid';

const BestSellingProducts = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestSelling = async () => {
            try {
                const { data } = await getBestSellingProducts();
                setProducts(data || []);
            } catch (error) {
                console.error('Failed to fetch best selling products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBestSelling();
    }, []);

    if (loading) return null; // Or skeleton
    if (products.length === 0) return null;

    return (
        <section className="py-24 bg-secondary/30 backdrop-blur-3xl border-y border-border/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <div className="flex items-center gap-3 text-blue-600 mb-2">
                            <div className="w-12 h-0.5 bg-blue-600 rounded-full" />
                            <span className="text-xs font-black uppercase tracking-[0.3em]">Bestsellers</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 tracking-tighter">
                            Most <span className="text-blue-600">Wanted</span> Now
                        </h2>
                        <p className="text-muted-foreground text-lg">The products everyone is talking about</p>
                    </div>
                    <Button asChild variant="outline" className="rounded-full px-8 font-bold border-blue-600/20 text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 active:scale-95">
                        <Link href="/shop?sort=-soldCount">Explore Collection</Link>
                    </Button>
                </div>

                <Grid cols={4} className="gap-x-8 gap-y-12">
                    {products.map((product, index) => (
                        <ProductCard key={product._id} product={product} index={index} />
                    ))}
                </Grid>
            </div>
        </section>
    );
};

export default BestSellingProducts;

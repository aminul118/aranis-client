'use client';

import { useEffect, useState } from 'react';
import { getProducts, IProduct } from '@/services/product/product';
import ProductCard from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const FeaturedProducts = () => {
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
            <div className="py-24 bg-muted/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <section className="py-24 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Excellence</h2>
                        <p className="text-muted-foreground">Our hand-picked selections for this season</p>
                    </div>
                    <Button asChild variant="link" className="text-blue-500 hover:text-blue-600 font-bold uppercase tracking-widest p-0 h-auto">
                        <Link href="/shop">View All Products</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredItems.map((product, index) => (
                        <ProductCard key={product._id} product={product} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;

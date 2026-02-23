'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { getTopRatedProducts, IProduct } from '@/services/product/product';
import ProductCard from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TopRatedProducts = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopRated = async () => {
            try {
                const { data } = await getTopRatedProducts();
                setProducts(data || []);
            } catch (error) {
                console.error('Failed to fetch top rated products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopRated();
    }, []);

    if (loading) return null; // Or skeleton
    if (products.length === 0) return null;

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 tracking-tighter">
                            The <span className="text-blue-600">Highest</span> Rating
                        </h2>
                        <p className="text-muted-foreground text-lg">Top selections rated by our worldwide community</p>
                    </div>
                    <Button asChild variant="ghost" className="text-muted-foreground hover:text-blue-600 font-black uppercase tracking-[0.2em] p-0 h-auto text-xs">
                        <Link href="/shop?sort=-rating">View All Ranked</Link>
                    </Button>
                </div>

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                    }}
                    className="pb-16"
                >
                    {products.map((product, index) => (
                        <SwiperSlide key={product._id}>
                            <ProductCard product={product} index={index} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default TopRatedProducts;

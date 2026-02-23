'use client';

import { useEffect, useState } from 'react';
import { getCategories, ICategory } from '@/services/category/category';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const categoryImages: Record<string, string> = {
    Men: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=800',
    Women: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
    Accessories: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
};

const Categories = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await getCategories({});
                setCategories(data || []);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return null;

    return (
        <section className="py-24 bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Shop by Category</h2>
                    <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="group relative overflow-hidden rounded-2xl aspect-3/4"
                        >
                            <Image
                                src={categoryImages[category.name] || categoryImages.Men}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent group-hover:via-slate-950/40 transition-all duration-300" />

                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                <p className="text-slate-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Discover our exclusive collection of {category.name.toLowerCase()}
                                </p>
                                <Link
                                    href={`/shop?category=${category.name}`}
                                    className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Explore Now
                                    <span className="ml-2 h-px w-0 bg-blue-400 group-hover:w-8 transition-all duration-300" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;

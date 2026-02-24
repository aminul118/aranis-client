'use client';

import { generateShopPath } from '@/lib/url-slugs';
import { getCategories, ICategory } from '@/services/category/category';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const categoryImages: Record<string, string> = {
  Men: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=800',
  Women:
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
  Accessories:
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
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
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Shop by Category
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-blue-600" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative aspect-3/4 overflow-hidden rounded-2xl"
            >
              <Image
                src={categoryImages[category.name] || categoryImages.Men}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent transition-all duration-300 group-hover:via-black/40" />

              <div className="absolute right-0 bottom-0 left-0 translate-y-4 p-8 text-white transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="mb-2 text-2xl font-bold">{category.name}</h3>
                <p className="mb-6 text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Discover our exclusive collection of{' '}
                  {category.name.toLowerCase()}
                </p>
                <Link
                  href={generateShopPath(category.name)}
                  className="inline-flex items-center text-sm font-bold tracking-widest text-blue-400 uppercase transition-colors hover:text-blue-300"
                >
                  Explore Now
                  <span className="ml-2 h-px w-0 bg-blue-400 transition-all duration-300 group-hover:w-8" />
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

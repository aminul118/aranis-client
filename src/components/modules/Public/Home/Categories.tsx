import { generateShopPath } from '@/lib/url-slugs';
import { getCategories } from '@/services/category/category';
import Image from 'next/image';
import Link from 'next/link';

const categoryImages: Record<string, string> = {
  Men: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=800',
  Women:
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
  Accessories:
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
};

const Categories = async () => {
  const { data: categories = [] } = await getCategories({});

  if (categories.length === 0) return null;

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Shop by Category
          </h2>
          <div className="bg-primary mx-auto h-1 w-20 rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category._id}
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
                  className="text-primary inline-flex items-center text-sm font-bold tracking-widest uppercase transition-colors"
                >
                  Explore Now
                  <span className="bg-primary ml-2 h-px w-0 transition-all duration-300 group-hover:w-8" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;

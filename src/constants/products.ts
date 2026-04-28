import { IProduct } from '@/types';

const generateProducts = (): IProduct[] => {
  const products: IProduct[] = [];

  const categories = {
    Men: {
      subCategories: {
        Shirts: ['Formal', 'Casual', 'Oversized'],
        Pants: ['Denim', 'Chinos', 'Cargo'],
        Blazers: ['Velvet', 'Wool', 'Linen'],
      },
      colors: ['Black', 'Blue', 'White', 'Beige', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    Women: {
      subCategories: {
        Dresses: ['Evening', 'Summer', 'Cocktail'],
        Tops: ['Blouses', 'Knitwear', 'Tees'],
        Skirts: ['Midi', 'Mini', 'Pleated'],
      },
      colors: ['Red', 'Emerald', 'Silk White', 'Pink', 'Lavender'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    Accessories: {
      subCategories: {
        Watches: ['Classic', 'Sport', 'Luxury'],
        Bags: ['Handbags', 'Backpacks', 'Clutches'],
        Jewelry: ['Necklaces', 'Bracelets', 'Rings'],
      },
      colors: ['Gold', 'Silver', 'Rose Gold', 'Black'],
      sizes: ['One Size'],
    },
  };

  const images = {
    Men: [
      'https://images.unsplash.com/photo-1594932224456-806c95465ec3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800',
    ],
    Women: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1539008886845-a968600cd9cd?auto=format&fit=crop&q=80&w=800',
    ],
    Accessories: [
      'https://images.unsplash.com/photo-1524592091214-8f97ad3fe019?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1548036627-14e4b51a896d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511499767390-903390e6fbc4?auto=format&fit=crop&q=80&w=800',
    ],
  };

  let id = 1;

  Object.entries(categories).forEach(([category, data]) => {
    Object.entries(data.subCategories).forEach(([subCategory, types]) => {
      types.forEach((type) => {
        // Create 3-4 products for each type to reach ~100
        for (let i = 1; i <= 4; i++) {
          const catImg = images[category as keyof typeof images];
          products.push({
            _id: String(id++),
            name: `${type} ${subCategory.slice(0, -1)} ${i}`,
            category,
            subCategory,
            type,
            price: Math.floor(Math.random() * (500 - 50 + 1) + 50),
            rating: Number((Math.random() * (5 - 4) + 4).toFixed(1)),
            image: catImg[i % catImg.length],
            description: `A premium ${type.toLowerCase()} ${subCategory.toLowerCase()} designed for maximum comfort and style. Part of our exclusive Aranis collection.`,
            details: [
              'High-quality sustainable materials',
              'Expertly crafted for a perfect fit',
              'Limited edition collection',
              'Easy care and durable',
            ],
            color: data.colors[i % data.colors.length],
            sizes: data.sizes,
            featured: Math.random() > 0.8,
            slug: `${type.toLowerCase()}-${subCategory.toLowerCase()}-${i}-${id}`.replace(
              /\s+/g,
              '-',
            ),
            stock: Math.floor(Math.random() * 100),
            buyPrice: Math.floor(Math.random() * (500 - 50 + 1) + 50) * 0.7,
          });
        }
      });
    });
  });

  return products;
};

export const products = generateProducts();

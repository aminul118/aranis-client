import generateSitemapEntries from '@/seo/generateSitemapEntries';
import { staticRoutes } from '@/seo/staticRoutes';
import { getCategories } from '@/services/category/category';
import { getProducts } from '@/services/product/product';
import { MetadataRoute } from 'next';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  // 1) Fetch dynamic data
  const [categoriesRes, productsRes] = await Promise.all([
    getCategories({}),
    getProducts({ limit: '1000' }), // Fetch a large batch for sitemap
  ]);

  const categories = categoriesRes?.data || [];
  const products = productsRes?.data || [];

  // 2) Map dynamic data to Routes format
  const dynamicCategoryRoutes = categories.map((cat) => ({
    url: `shop?category=${cat.name}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const dynamicProductRoutes = products.map((prod) => ({
    url: `products/${prod.slug || prod._id}`,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // 3) Combine static and dynamic routes
  const allRoutes = [
    ...staticRoutes,
    ...dynamicCategoryRoutes,
    ...dynamicProductRoutes,
  ];

  return generateSitemapEntries(allRoutes);
};

export default sitemap;

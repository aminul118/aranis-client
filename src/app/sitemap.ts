import { toUrlSlug } from '@/lib/url-slugs';
import generateSitemapEntries from '@/seo/generateSitemapEntries';
import { staticRoutes } from '@/seo/staticRoutes';
import { getNavbars } from '@/services/navbar/navbar';
import { getProducts } from '@/services/product/product';
import { MetadataRoute } from 'next';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  // 1) Fetch dynamic data
  const [navRes, productsRes] = await Promise.all([
    getNavbars({ limit: '1000' }),
    getProducts({ limit: '1000' }), // Fetch a large batch for sitemap
  ]);

  const navItems = navRes?.data || [];
  const products = productsRes?.data || [];

  // 2) Map dynamic data to Routes format
  // Recursively generate all categorization routes from navbar
  const categorizationRoutes: any[] = [];

  navItems.forEach((item) => {
    const categorySlug = toUrlSlug(item.title);
    categorizationRoutes.push({
      url: categorySlug,
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    item.subItems?.forEach((sub) => {
      const subCategorySlug = sub.title ? toUrlSlug(sub.title) : null;
      if (subCategorySlug) {
        categorizationRoutes.push({
          url: `${categorySlug}/${subCategorySlug}`,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }

      sub.items.forEach((type) => {
        const typeSlug = toUrlSlug(type.label);
        const itemUrl =
          type.url ||
          (subCategorySlug
            ? `${categorySlug}/${subCategorySlug}/${typeSlug}`
            : `${categorySlug}/${typeSlug}`);

        categorizationRoutes.push({
          url: itemUrl.startsWith('/') ? itemUrl.slice(1) : itemUrl,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      });
    });
  });

  const dynamicProductRoutes = products.map((prod) => ({
    url: `products/${prod.slug || prod._id}`,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // 3) Combine static and dynamic routes
  const allRoutes = [
    ...staticRoutes,
    ...categorizationRoutes,
    ...dynamicProductRoutes,
  ];

  return generateSitemapEntries(allRoutes);
};

export default sitemap;

import BestSellingProducts from '@/components/modules/Public/Home/BestSellingProducts';
import Categories from '@/components/modules/Public/Home/Categories';
import FeaturedProducts from '@/components/modules/Public/Home/FeaturedProducts';
import HeroBanner from '@/components/modules/Public/Home/HeroBanner';
import HomeSEOContent from '@/components/modules/Public/Home/HomeSEOContent';
import {
  CategorySkeleton,
  ProductGridSkeleton,
} from '@/components/modules/Public/Home/HomeSkeletons';
import TopRatedProducts from '@/components/modules/Public/Home/TopRatedProducts';
import generateMetaTags from '@/seo/generateMetaTags';
import {
  getHeroBanners,
  getMiniBanners,
} from '@/services/hero-banner/hero-banner';
import { getSiteSettings } from '@/services/settings/settings';
import { Metadata } from 'next';
import { Suspense } from 'react';

const HomePage = async () => {
  const [heroBannersRes, miniBannersRes] = await Promise.all([
    getHeroBanners({ isActive: 'true', sort: 'order' }),
    getMiniBanners({ isActive: 'true', sort: 'order' }),
  ]);

  return (
    <>
      <HeroBanner
        mainSlides={heroBannersRes?.data}
        miniBanners={miniBannersRes?.data}
      />
      <Suspense fallback={<CategorySkeleton />}>
        <Categories />
      </Suspense>
      <Suspense
        fallback={
          <ProductGridSkeleton
            title="Featured Excellence"
            subtitle="Our hand-picked selections for this season"
          />
        }
      >
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<ProductGridSkeleton title="The Highest Rating" />}>
        <TopRatedProducts />
      </Suspense>
      <Suspense fallback={<ProductGridSkeleton title="Most Wanted Now" />}>
        <BestSellingProducts />
      </Suspense>
      <HomeSEOContent />
    </>
  );
};

export default HomePage;

// Dynamic SEO Metatag
export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();

  return generateMetaTags({
    title: settings?.title || 'Lumiere Fashion | Premium Contemporary Apparel',
    description:
      settings?.description ||
      'Lumiere Fashion offers a curated collection of premium clothing, blending contemporary design with timeless elegance.',
    keywords:
      settings?.keywords ||
      'Lumiere Fashion, Premium Clothing, Luxury Apparel, Fashion E-commerce, Men Fashion, Women Fashion',
    websitePath: '/',
    image: settings?.baseImage,
  });
}

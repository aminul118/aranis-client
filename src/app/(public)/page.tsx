import HeroBanner from '@/app/(public)/_components/HeroBanner/HeroBanner';
import NewArrivals from '@/app/(public)/_components/NewArrivals';
import generateMetaTags from '@/seo/generateMetaTags';
import { getHeroBanners } from '@/services/banners/hero-banner/hero-banner';
import { getMiniBanners } from '@/services/banners/mini-banner/mini-banner';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const BestSellingProducts = dynamic(
  () => import('@/app/(public)/_components/BestSellingProducts'),
);
const FeaturedProducts = dynamic(
  () => import('@/app/(public)/_components/FeaturedProducts'),
);
const HomeSEOContent = dynamic(
  () => import('@/app/(public)/_components/HomeSEOContent'),
);

const HomePage = async () => {
  const [heroBannersRes, miniBannersRes] = await Promise.all([
    getHeroBanners({ isActive: 'true', sort: 'order' }),
    getMiniBanners({ isActive: 'true', sort: 'order' }),
  ]);

  const firstHeroImage = heroBannersRes?.data?.[0]?.image;
  const firstMiniBanners = miniBannersRes?.data?.slice(0, 2) || [];

  return (
    <>
      {/* Manually force preload the raw CDN images for absolute fastest LCP */}
      {firstHeroImage && (
        <link
          rel="preload"
          as="image"
          href={firstHeroImage}
          fetchPriority="high"
        />
      )}
      {firstMiniBanners.map((banner, i) => (
        <link
          key={i}
          rel="preload"
          as="image"
          href={banner.image}
          fetchPriority="high"
        />
      ))}

      <HeroBanner
        mainSlides={heroBannersRes?.data}
        miniBanners={miniBannersRes?.data}
      />
      <NewArrivals />
      <BestSellingProducts />
      <FeaturedProducts />
      <HomeSEOContent />
    </>
  );
};

export default HomePage;

// SEO MetaTag
export async function generateMetadata(): Promise<Metadata> {
  return generateMetaTags({
    title: 'The Aranis | Premium Contemporary Apparel',
    description:
      'The Aranis offers a curated collection of premium clothing, blending contemporary design with timeless elegance.',
    keywords:
      'Aranis Fashion, Premium Clothing, Luxury Apparel, Fashion E-commerce, Men Fashion, Women Fashion',
    websitePath: '/',
  });
}

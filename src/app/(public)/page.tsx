import BestSellingProducts from '@/app/(public)/_components/BestSellingProducts';
import FeaturedProducts from '@/app/(public)/_components/FeaturedProducts';
import HeroBanner from '@/app/(public)/_components/HeroBanner';
import HomeSEOContent from '@/app/(public)/_components/HomeSEOContent';
import NewArrivals from '@/app/(public)/_components/NewArrivals';
import generateMetaTags from '@/seo/generateMetaTags';
import {
  getHeroBanners,
  getMiniBanners,
} from '@/services/hero-banner/hero-banner';
import { Metadata } from 'next';

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
      <NewArrivals />
      <BestSellingProducts />
      <FeaturedProducts />
      <HomeSEOContent />
    </>
  );
};

export default HomePage;

// SEO Metatag
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

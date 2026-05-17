import BestSellingProducts from '@/components/modules/Public/Home/BestSellingProducts';
import FeaturedProducts from '@/components/modules/Public/Home/FeaturedProducts';
import HeroBanner from '@/components/modules/Public/Home/HeroBanner';
import HomeSEOContent from '@/components/modules/Public/Home/HomeSEOContent';
import NewArrivals from '@/components/modules/Public/Home/NewArrivals';
import generateMetaTags from '@/seo/generateMetaTags';
import {
  getHeroBanners,
  getMiniBanners,
} from '@/services/hero-banner/hero-banner';
import { getSiteSettings } from '@/services/settings/settings';
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

// Dynamic SEO Metatag
export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();

  return generateMetaTags({
    title: settings?.title || 'The Aranis | Premium Contemporary Apparel',
    description:
      settings?.description ||
      'The Aranis offers a curated collection of premium clothing, blending contemporary design with timeless elegance.',
    keywords:
      settings?.keywords ||
      'Aranis Fashion, Premium Clothing, Luxury Apparel, Fashion E-commerce, Men Fashion, Women Fashion',
    websitePath: '/',
    image: settings?.baseImage,
  });
}

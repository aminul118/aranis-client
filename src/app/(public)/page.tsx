import BestSellingProducts from '@/components/modules/Public/Home/BestSellingProducts';
import Categories from '@/components/modules/Public/Home/Categories';
import FeaturedProducts from '@/components/modules/Public/Home/FeaturedProducts';
import HeroBanner from '@/components/modules/Public/Home/HeroBanner';
import HomeSEOContent from '@/components/modules/Public/Home/HomeSEOContent';
import TopRatedProducts from '@/components/modules/Public/Home/TopRatedProducts';
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
      <Categories />
      <FeaturedProducts />
      <TopRatedProducts />
      <BestSellingProducts />
      <HomeSEOContent />
    </>
  );
};

export default HomePage;

//  SEO Metatag
export const metadata: Metadata = generateMetaTags({
  title: 'Lumiere Fashion | Premium Contemporary Apparel & Accessories',
  description:
    'Lumiere Fashion offers a curated collection of premium clothing, blending contemporary design with timeless elegance. Discover our latest collections for men and women.',
  keywords:
    'Lumiere Fashion, Premium Clothing, Luxury Apparel, Fashion E-commerce, Men Fashion, Women Fashion, Accessories, Designer Clothing, Online Shopping',
  websitePath: '/',
});

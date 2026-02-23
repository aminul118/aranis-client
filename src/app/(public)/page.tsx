import HeroBanner from '@/components/modules/Public/Home/HeroBanner';
import Categories from '@/components/modules/Public/Home/Categories';
import FeaturedProducts from '@/components/modules/Public/Home/FeaturedProducts';
import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';

const HomePage = async () => {
  return (
    <>
      <HeroBanner />
      <Categories />
      <FeaturedProducts />
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

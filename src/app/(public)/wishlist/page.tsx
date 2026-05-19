import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import WishlistContent from './_components/WishlistContent';

export default function WishlistPage() {
  return <WishlistContent />;
}

export const metadata: Metadata = generateMetaTags({
  title: 'My Wishlist | Aranis Fashion',
  description:
    'Manage your saved premium fashion articles, adjust quantities, or add them directly to your shopping cart on Aranis Fashion.',
  keywords:
    'wishlist, saved items, premium clothes, shopping cart, Aranis Fashion',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/wishlist',
});

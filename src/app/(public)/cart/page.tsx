import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import CartContent from './_components/CartContent';

export default function CartPage() {
  return <CartContent />;
}

export const metadata: Metadata = generateMetaTags({
  title: 'Shopping Cart | Aranis Fashion',
  description:
    'Review your premium fashion selection, manage quantities, sizes, and apply coupon discount vouchers on Aranis Fashion.',
  keywords: 'shopping cart, bag, checkout, coupon code, Aranis Fashion',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/cart',
});

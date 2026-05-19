import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutContent from './_components/CheckoutContent';

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

export const metadata: Metadata = generateMetaTags({
  title: 'Secure Checkout | Aranis Fashion',
  description:
    'Complete your Aranis Fashion premium order securely with cash on delivery or online payments, protected by modern encryption.',
  keywords:
    'checkout, secure checkout, Aranis Fashion, premium fashion checkout, clothing order payment',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/checkout',
});

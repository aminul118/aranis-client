import TopLoadingBar from '@/components/common/loader/TopLoadingBar';
import ReloadTracker from '@/components/common/ReloadTracker';
import envVars from '@/config/env.config';
import fonts from '@/config/fonts.config';
import { Providers } from '@/providers/Providers';
import generateMetaTags from '@/seo/generateMetaTags';
import '@/styles/custom.css';
import '@/styles/globals.css';
import { Children } from '@/types';
import { GoogleTagManager } from '@next/third-parties/google';
import { Metadata } from 'next';

const MainLayout = ({ children }: Children) => {
  return (
    <html
      lang="en"
      className={fonts.spaceGrotesk.variable}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <link
          rel="preconnect"
          href="https://cdn.thearanis.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.thearanis.com" />
      </head>
      <body className={fonts.spaceGrotesk.className} suppressHydrationWarning>
        <TopLoadingBar />
        <ReloadTracker />
        <Providers>{children}</Providers>
      </body>
      <GoogleTagManager gtmId={envVars.analytics.googleTagManagerId} />
    </html>
  );
};

export default MainLayout;

// Global SEO Metatag
export async function generateMetadata(): Promise<Metadata> {
  return generateMetaTags({
    title: 'The Aranis | Premium Contemporary Clothing',
    description:
      'The Aranis - Discover curated collections of luxury apparel blending modern design with timeless elegance.',
    keywords:
      'The Aranis, Luxury Apparel, Premium Clothing, Fashion E-commerce, Designer Wear',
  });
}

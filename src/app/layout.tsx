import TopLoadingBar from '@/components/common/loader/TopLoadingBar';
import envVars from '@/config/env.config';
import fonts from '@/config/fonts.config';
import { Providers } from '@/providers/Providers';
import generateMetaTags from '@/seo/generateMetaTags';
import '@/styles/custom.css';
import '@/styles/globals.css';
import { Children } from '@/types';
import { Metadata } from 'next';
import Script from 'next/script';

const MainLayout = ({ children }: Children) => {
  return (
    <html
      lang="en"
      className={fonts.spaceGrotesk.variable}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://cdn.thearanis.com" />
        <link rel="dns-prefetch" href="https://cdn.thearanis.com" />
      </head>
      <body className={fonts.spaceGrotesk.className} suppressHydrationWarning>
        <TopLoadingBar />
        <Providers>{children}</Providers>
      </body>
      <Script
        id="gtm-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(function() {
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer', '${envVars.analytics.googleTagManagerId}');
            }, 3500);
          `,
        }}
      />
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

import { CartProvider } from '@/context/CartContext';
import TopLoadingBar from '@/components/common/loader/TopLoadingBar';
import { TooltipProvider } from '@/components/ui/tooltip';
import envVars from '@/config/env.config';
import fonts from '@/config/fonts.config';
import ThemeProvider from '@/providers/ThemeProvider';
import generateMetaTags from '@/seo/generateMetaTags';
import '@/styles/custom.css';
import '@/styles/globals.css';
import { Children } from '@/types';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Metadata } from 'next';
import { Toaster } from 'sonner';

const MainLayout = ({ children }: Children) => {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <GoogleAnalytics gaId={envVars.analytics.googleAnalytics} />
        <body className={fonts.spaceGrotesk.className} suppressHydrationWarning>
          <TopLoadingBar />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </CartProvider>
            <Toaster position="top-right" richColors theme="dark" />
          </ThemeProvider>
        </body>
        <GoogleTagManager gtmId={envVars.analytics.googleTagManagerId} />
      </html>
    </>
  );
};

export default MainLayout;

//  SEO Metatag
export const metadata: Metadata = generateMetaTags({
  title: 'Lumiere Fashion | Premium Contemporary Clothing',
  description:
    'Lumiere Fashion - Discover curated collections of luxury apparel blending modern design with timeless elegance.',
  keywords:
    'Lumiere Fashion, Luxury Apparel, Premium Clothing, Fashion E-commerce, Designer Wear',
});

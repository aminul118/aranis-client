import GlobalOfferModal from '@/components/common/GlobalOfferModal';
import Logo from '@/components/common/Logo';
import Footer from '@/components/layouts/Footer/Footer';
import ChatFloatingButton from '@/components/layouts/Navbar/ChatFloatingButton';
import MobileBottomNav from '@/components/layouts/Navbar/MobileBottomNav';
import Navbar from '@/components/layouts/Navbar/Navbar';
import { getNavbars } from '@/services/navbar/navbar';
import { getOffers } from '@/services/offer/offer';
import { getSiteSettings } from '@/services/settings/settings';
import { getMe } from '@/services/user/users';
import { Children } from '@/types';

export const dynamic = 'force-dynamic';

const RootLayout = async ({ children }: Children) => {
  let user = null;
  try {
    const { data } = await getMe();
    user = data;
  } catch (error) {
    // Gracefully handle unauthenticated user
  }

  const [navItemsRes, siteSettingsRes, offersRes] = await Promise.all([
    getNavbars({ limit: '1000' }),
    getSiteSettings(),
    getOffers(),
  ]);

  const navItems = navItemsRes?.data || [];
  const siteSettings = siteSettingsRes?.data;
  const activeOffers = offersRes?.data || [];

  const sortedNavItems = [...navItems].sort((a, b) => a.order - b.order);

  return (
    <main className="mt-4 flex min-h-screen flex-col pb-16 lg:mt-0 lg:pb-0">
      <Navbar
        user={user as any}
        navItems={sortedNavItems as any}
        activeOffers={activeOffers}
        logo={<Logo className="text-white" />}
        siteSettings={siteSettings}
      />
      <div className="grow pt-[60px] lg:pt-[176px]">{children}</div>
      <ChatFloatingButton user={user as any} siteSettings={siteSettings} />
      <GlobalOfferModal />
      <MobileBottomNav user={user as any} />
      <Footer
        socialLinks={siteSettings?.socialLinks}
        navItems={sortedNavItems as any}
        siteSettings={siteSettings}
      />
    </main>
  );
};

export default RootLayout;

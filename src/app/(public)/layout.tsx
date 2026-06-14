import Navbar from '@/app/(public)/_components/layouts/Navbar/Navbar';
import Logo from '@/components/common/Logo';
import { getNavbars } from '@/services/navbar/navbar';
import { getOffers } from '@/services/offer/offer';
import { getSiteSettings } from '@/services/settings/settings';
import { getMe } from '@/services/user/users';
import { Children } from '@/types';
import nextDynamic from 'next/dynamic';

const ChatFloatingButton = nextDynamic(
  () => import('@/app/(public)/_components/layouts/ChatFloatingButton'),
);
const Footer = nextDynamic(
  () => import('@/app/(public)/_components/layouts/Footer/Footer'),
);
const MobileBottomNav = nextDynamic(
  () => import('@/app/(public)/_components/layouts/Navbar/MobileBottomNav'),
);
const GlobalOfferModal = nextDynamic(
  () => import('@/components/common/GlobalOfferModal'),
);

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
        logo={<Logo className="text-white" logoUrl={siteSettings?.logo} />}
        siteSettings={siteSettings}
      />
      <div className="grow pt-[60px] lg:pt-[176px]">{children}</div>
      <GlobalOfferModal />
      <MobileBottomNav user={user as any} />
      <ChatFloatingButton user={user as any} siteSettings={siteSettings} />
      <Footer
        socialLinks={siteSettings?.socialLinks}
        navItems={sortedNavItems as any}
        siteSettings={siteSettings}
      />
    </main>
  );
};

export default RootLayout;

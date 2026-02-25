import Logo from '@/components/common/Logo';
import Footer from '@/components/layouts/Footer/Footer';
import ChatFloatingButton from '@/components/layouts/Navbar/ChatFloatingButton';
import MobileBottomNav from '@/components/layouts/Navbar/MobileBottomNav';
import Navbar from '@/components/layouts/Navbar/Navbar';
import { getNavbars } from '@/services/navbar/navbar';
import { getSiteSettings } from '@/services/settings/settings';
import { getMe } from '@/services/user/users';
import { Children } from '@/types';

const RootLayout = async ({ children }: Children) => {
  let user = null;
  try {
    const { data } = await getMe();
    user = data;
  } catch (error) {
    // Gracefully handle unauthenticated user
  }

  const [navItemsRes, siteSettingsRes] = await Promise.all([
    getNavbars({}),
    getSiteSettings(),
  ]);

  const navItems = navItemsRes?.data || [];
  const siteSettings = siteSettingsRes?.data;

  const sortedNavItems = [...navItems].sort((a, b) => a.order - b.order);

  return (
    <main className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <Navbar
        user={user as any}
        navItems={sortedNavItems as any}
        logo={<Logo className="text-white" />}
      />
      <div className="grow pt-[60px] lg:pt-[176px]">{children}</div>
      <ChatFloatingButton user={user as any} />
      <MobileBottomNav />
      <Footer socialLinks={siteSettings?.socialLinks} />
    </main>
  );
};

export default RootLayout;

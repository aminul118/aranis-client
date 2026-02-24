import Footer from '@/components/layouts/Footer/Footer';
import ChatFloatingButton from '@/components/layouts/Navbar/ChatFloatingButton';
import Navbar from '@/components/layouts/Navbar/Navbar';
import { getNavbars } from '@/services/navbar/navbar';
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

  const { data: navItems } = await getNavbars({});
  const sortedNavItems = [...(navItems || [])].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar user={user as any} navItems={sortedNavItems as any} />
      <div className="grow pt-[60px] lg:pt-[156px]">{children}</div>
      <ChatFloatingButton user={user as any} />
      <Footer />
    </main>
  );
};

export default RootLayout;

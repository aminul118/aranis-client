import { getSiteSettings } from '@/services/settings/settings';
import { getMe } from '@/services/user/users';
import { Children } from '@/types';
import { Metadata } from 'next';
import MobileBackButton from './_componnets/layouts/MobileBackButton';
import MobileDashboardNav from './_componnets/layouts/MobileDashboardNav';
import UserSidebar from './_componnets/layouts/user-sidebar';

export const dynamic = 'force-dynamic';

const UserLayout = async ({ children }: Children) => {
  const [{ data: user }, siteSettingsRes] = await Promise.all([
    getMe(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* User Sidebar (Hidden on Mobile) */}
          <aside className="hidden h-fit w-full shrink-0 lg:sticky lg:top-32 lg:block lg:w-72">
            <UserSidebar
              user={user as any}
              logoUrl={siteSettingsRes?.data?.logo}
            />
          </aside>

          {/* Main Content */}
          <main className="w-full flex-1 overflow-hidden">
            <MobileDashboardNav />
            <MobileBackButton />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;

export const metadata: Metadata = {
  title: 'My Portal | Aranis',
};

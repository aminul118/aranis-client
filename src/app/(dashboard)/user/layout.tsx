import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getSiteSettings } from '@/services/settings/settings';
import { getMe } from '@/services/user/users';
import { Children } from '@/types';
import { Metadata } from 'next';
import UserSidebar from './_componnets/layouts/user-sidebar';
import UserHeader from './_componnets/layouts/UserHeader';

export const dynamic = 'force-dynamic';

const UserLayout = async ({ children }: Children) => {
  const [{ data: user }, siteSettingsRes] = await Promise.all([
    getMe(),
    getSiteSettings(),
  ]);

  return (
    <SidebarProvider>
      {/* User Sidebar */}
      <UserSidebar user={user as any} logoUrl={siteSettingsRes?.data?.logo} />
      <SidebarInset>
        <UserHeader user={user as any} />
        <>{children}</>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default UserLayout;

export const metadata: Metadata = {
  title: 'My Portal | Aranis',
};

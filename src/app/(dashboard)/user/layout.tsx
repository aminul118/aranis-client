import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getMe } from '@/services/user/users';
import { Children } from '@/types';
import { Metadata } from 'next';
import UserSidebar from './_componnets/layouts/user-sidebar';
import UserHeader from './_componnets/layouts/UserHeader';

export const dynamic = 'force-dynamic';

const UserLayout = async ({ children }: Children) => {
  const { data: user } = await getMe();
  return (
    <SidebarProvider>
      {/* User Sidebar */}
      <UserSidebar user={user as any} />
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

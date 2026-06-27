import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getSiteSettings } from '@/services/settings/settings';
import type { IUser } from '@/services/user/user.interface';
import { getMe } from '@/services/user/users';
import { Children } from '@/types';
import { Metadata } from 'next';
import AdminSidebar from './_components/layouts/admin-sidebar';
import AdminHeader from './_components/layouts/AdminHeader';

export const dynamic = 'force-dynamic';

const AdminLayout = async ({ children }: Children) => {
  const [{ data: user }, siteSettingsRes] = await Promise.all([
    getMe(),
    getSiteSettings(),
  ]);
  if (!user) {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AdminSidebar
        user={user as IUser}
        logoUrl={siteSettingsRes?.data?.logo}
      />
      <SidebarInset>
        <AdminHeader user={user as IUser} />
        <>{children}</>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;

// SEO
export const metadata: Metadata = {
  title: 'Dashboard | Aranis Admin',
};

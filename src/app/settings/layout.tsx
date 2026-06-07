import SettingsSidebar from '@/app/(dashboard)/admin/settings/_components/SettingsSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getSiteSettings } from '@/services/settings/settings';
import { getMe } from '@/services/user/users';
import { Role } from '@/types';
import { Suspense } from 'react';
import AdminSidebar from '../(dashboard)/admin/_components/layouts/admin-sidebar';
import AdminHeader from '../(dashboard)/admin/_components/layouts/AdminHeader';
import { AdminSidebarSkeleton } from '../(dashboard)/admin/_components/layouts/AdminSidebarSkeleton';
import UserSidebar from '../(dashboard)/user/_componnets/layouts/user-sidebar';
import UserHeader from '../(dashboard)/user/_componnets/layouts/UserHeader';

export const dynamic = 'force-dynamic';

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ data: user }, { data: siteSettings }] = await Promise.all([
    getMe(),
    getSiteSettings(),
  ]);

  if (!user) {
    return null;
  }

  const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;

  if (isAdmin) {
    return (
      <SidebarProvider>
        <Suspense fallback={<AdminSidebarSkeleton />}>
          <AdminSidebar user={user} logoUrl={siteSettings?.logo} />
        </Suspense>
        <SidebarInset>
          <AdminHeader user={user} />
          <div className="container mx-auto p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your admin account settings and preferences
              </p>
            </div>
            <div className="flex flex-col gap-6 lg:flex-row">
              <SettingsSidebar basePath="/settings" user={user} />
              <main className="max-w-3xl flex-1">{children}</main>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <Suspense fallback={<AdminSidebarSkeleton />}>
        <UserSidebar user={user} />
      </Suspense>
      <SidebarInset>
        <UserHeader user={user} />
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Account Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Update your profile, change password and manage your preferences.
            </p>
          </div>
          <div className="flex flex-col gap-8 lg:flex-row">
            <SettingsSidebar basePath="/settings" user={user} />
            <main className="max-w-4xl flex-1">{children}</main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

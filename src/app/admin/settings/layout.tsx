import AdminSidebar from '@/components/layouts/Admin/admin-sidebar';
import AdminHeader from '@/components/layouts/Admin/AdminHeader';
import { AdminSidebarSkeleton } from '@/components/layouts/Admin/AdminSidebarSkeleton';
import SettingsSidebar from '@/components/modules/Admin/settings/SettingsSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getMe } from '@/services/user/users';
import { Suspense } from 'react';

export default async function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = await getMe();

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <Suspense fallback={<AdminSidebarSkeleton />}>
        <AdminSidebar user={user} />
      </Suspense>
      <SidebarInset>
        <AdminHeader user={user} />
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              System Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure system-wide parameters and branding.
            </p>
          </div>
          <div className="flex flex-col gap-8 lg:flex-row">
            <SettingsSidebar basePath="/admin/settings" user={user} />
            <main className="max-w-4xl flex-1">{children}</main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

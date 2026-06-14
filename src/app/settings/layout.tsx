import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getSiteSettings } from '@/services/settings/settings';
import { getMe } from '@/services/user/users';
import { Role } from '@/types';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import AdminSidebar from '../admin/_components/layouts/admin-sidebar';
import AdminHeader from '../admin/_components/layouts/AdminHeader';
import { AdminSidebarSkeleton } from '../admin/_components/layouts/AdminSidebarSkeleton';

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
            <main className="max-w-3xl flex-1">{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // If not admin, redirect them to the new dashboard structure
  redirect('/dashboard/profile');
}

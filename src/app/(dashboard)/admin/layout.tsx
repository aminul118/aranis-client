import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getMe } from '@/services/user/users';
import { Children } from '@/types';
import { Metadata } from 'next';
import { Suspense } from 'react';
import AdminSidebar from './_components/layouts/admin-sidebar';
import AdminHeader from './_components/layouts/AdminHeader';
import { AdminSidebarSkeleton } from './_components/layouts/AdminSidebarSkeleton';

export const dynamic = 'force-dynamic';

const AdminLayout = async ({ children }: Children) => {
  const { data: user } = await getMe();

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <Suspense fallback={<AdminSidebarSkeleton />}>
        <AdminSidebar user={user as any} />
      </Suspense>
      <SidebarInset>
        <AdminHeader user={user as any} />
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

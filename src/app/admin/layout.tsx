import AdminSidebar from '@/components/layouts/Admin/admin-sidebar';
import AdminHeader from '@/components/layouts/Admin/AdminHeader';
import { AdminSidebarSkeleton } from '@/components/layouts/Admin/AdminSidebarSkeleton';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getMe } from '@/services/user/users';
import { Children } from '@/types';
import { Metadata } from 'next';
import { Suspense } from 'react';

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
  title: 'Dashboard | Aminul Islam',
};

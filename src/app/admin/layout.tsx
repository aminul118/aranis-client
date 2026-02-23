import { AdminSidebarSkeleton } from '@/components/layouts/Admin/AdminSidebarSkeleton';
import DashboardBreadcrumb from '@/components/layouts/Admin/DashboardBreadcrumb ';
import AdminSidebar from '@/components/layouts/Admin/admin-sidebar';
import AdminHeader from '@/components/layouts/Admin/AdminHeader';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Children } from '@/types';
import { Metadata } from 'next';
import { Suspense } from 'react';

const AdminLayout = ({ children }: Children) => {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <Suspense fallback={<AdminSidebarSkeleton />}>
        <AdminSidebar />
      </Suspense>
      <SidebarInset>
        <AdminHeader />
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

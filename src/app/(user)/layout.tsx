import UserSidebar from '@/components/layouts/User/user-sidebar';
import UserHeader from '@/components/layouts/User/UserHeader';
import {
    SidebarInset,
    SidebarProvider,
} from '@/components/ui/sidebar';
import { Children } from '@/types';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminSidebarSkeleton } from '@/components/layouts/Admin/AdminSidebarSkeleton';

const UserLayout = ({ children }: Children) => {
    return (
        <SidebarProvider>
            {/* User Sidebar */}
            <Suspense fallback={<AdminSidebarSkeleton />}>
                <UserSidebar />
            </Suspense>
            <SidebarInset>
                <UserHeader />
                <>{children}</>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default UserLayout;

export const metadata: Metadata = {
    title: 'My Portal | Lumiere',
};

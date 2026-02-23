import { getMe } from '@/services/user/users';
import AdminSidebar from '@/components/layouts/Admin/admin-sidebar';
import AdminHeader from '@/components/layouts/Admin/AdminHeader';
import UserSidebar from '@/components/layouts/User/user-sidebar';
import UserHeader from '@/components/layouts/User/UserHeader';
import SettingsSidebar from '@/components/modules/Admin/settings/SettingsSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Suspense } from 'react';
import { AdminSidebarSkeleton } from '@/components/layouts/Admin/AdminSidebarSkeleton';
import { Role } from '@/types';

export default async function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: user } = await getMe();

    if (!user) {
        return null;
    }

    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;

    if (isAdmin) {
        return (
            <SidebarProvider>
                <Suspense fallback={<AdminSidebarSkeleton />}>
                    <AdminSidebar />
                </Suspense>
                <SidebarInset>
                    <AdminHeader />
                    <div className="container mx-auto p-6">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold">Settings</h1>
                            <p className="text-muted-foreground mt-2">
                                Manage your admin account settings and preferences
                            </p>
                        </div>
                        <div className="flex flex-col gap-6 lg:flex-row">
                            <SettingsSidebar basePath="/settings" />
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
                <UserSidebar />
            </Suspense>
            <SidebarInset>
                <UserHeader />
                <div className="container mx-auto p-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                        <p className="text-muted-foreground mt-1">
                            Update your profile, change password and manage your preferences.
                        </p>
                    </div>
                    <div className="flex flex-col gap-8 lg:flex-row">
                        <SettingsSidebar basePath="/settings" />
                        <main className="max-w-4xl flex-1">{children}</main>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

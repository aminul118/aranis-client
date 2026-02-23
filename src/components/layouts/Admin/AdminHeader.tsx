'use client';

import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAdminStats } from '@/services/stats/stats';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import DashboardBreadcrumb from './DashboardBreadcrumb ';

const AdminHeader = () => {
    const [pendingOrders, setPendingOrders] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await getAdminStats();
                setPendingOrders(data.orderStatusDistribution.Pending || 0);
            } catch (error) {
                console.error('Failed to fetch stats for notifications:', error);
            }
        };
        fetchStats();
        // Poll every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <DashboardBreadcrumb />
            </div>

            <div className="flex items-center gap-4">
                {/* Order Notifications */}
                <div className="relative group cursor-pointer hover:bg-accent p-2 rounded-full transition-colors">
                    <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    {pendingOrders > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse transition-all">
                            {pendingOrders > 99 ? '99+' : pendingOrders}
                        </span>
                    )}

                    {/* Notifications Dropdown (Simplified) */}
                    <div className="absolute right-0 top-full mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-right bg-popover border rounded-xl shadow-xl p-4 z-50">
                        <h4 className="text-sm font-bold border-b pb-2 mb-2">Notifications</h4>
                        <div className="space-y-3">
                            {pendingOrders > 0 ? (
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <div>
                                        <p className="text-xs font-medium">New Order Requests</p>
                                        <p className="text-[10px] text-muted-foreground">
                                            You have {pendingOrders} pending orders to review.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-4">
                                    No new notifications
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;

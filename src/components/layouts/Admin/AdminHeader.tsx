'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSocket } from '@/hooks/useSocket';
import { getAdminStats } from '@/services/stats/stats';
import { IUser } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import HeaderUser from '../shared/HeaderUser';
import NotificationBell from '../shared/NotificationBell';
import DashboardBreadcrumb from './DashboardBreadcrumb ';

const AdminHeader = ({ user }: { user: IUser }) => {
  const [pendingOrders, setPendingOrders] = useState(0);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await getAdminStats();
      setPendingOrders(data.orderStatusDistribution.Pending || 0);
    } catch (error) {
      console.error('Failed to fetch stats for notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Poll every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Listen for real-time updates to refresh stats
  useSocket(fetchStats);
  useSocket(fetchStats, undefined, 'new-order-placed');

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b px-4 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <DashboardBreadcrumb />
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell user={user} />

        <div className="bg-border mx-1 h-6 w-px" />
        <HeaderUser user={user} portalType="admin" />
      </div>
    </header>
  );
};

export default AdminHeader;

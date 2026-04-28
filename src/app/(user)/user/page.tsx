import SetPasswordPrompt from '@/components/common/SetPasswordPrompt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMyOrders } from '@/services/order/order';
import { getMe } from '@/services/user/users';
import { PackageOpen, ShoppingBag, User } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'My Dashboard | Aranis' };

const UserDashboardPage = async () => {
  const { data: user } = await getMe();
  const { data: orders } = await getMyOrders({});

  const orderCount = Array.isArray(orders) ? orders.length : 0;
  const pendingCount = Array.isArray(orders)
    ? orders.filter((o) => o.status === 'Pending').length
    : 0;

  return (
    <div className="container mx-auto space-y-8 px-6 py-8">
      {user && <SetPasswordPrompt user={user} />}
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.firstName || 'User'} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's a summary of your account activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{orderCount}</div>
            <p className="text-muted-foreground mt-1 text-xs">All time</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Pending Orders
            </CardTitle>
            <PackageOpen className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCount}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Awaiting dispatch
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Account
            </CardTitle>
            <User className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="truncate text-lg font-bold">{user?.email}</div>
            <p className="text-muted-foreground mt-1 text-xs capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/user/orders"
            className="rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-500/20"
          >
            View My Orders →
          </Link>
          <Link
            href="/products"
            className="rounded-lg bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-500 transition-colors hover:bg-purple-500/20"
          >
            Browse Products →
          </Link>
          <Link
            href="/user/settings/profile"
            className="rounded-lg bg-slate-500/10 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-500/20"
          >
            Edit Profile →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;

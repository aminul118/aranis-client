import { getMe } from '@/services/user/users';
import { getMyOrders } from '@/services/order/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageOpen, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Dashboard | Lumiere' };

const UserDashboardPage = async () => {
    const { data: user } = await getMe();
    const { data: orders } = await getMyOrders({});

    const orderCount = Array.isArray(orders) ? orders.length : 0;
    const pendingCount = Array.isArray(orders)
        ? orders.filter((o) => o.status === 'Pending').length
        : 0;

    return (
        <div className="container mx-auto px-6 py-8 space-y-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Orders
                        </CardTitle>
                        <ShoppingBag className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{orderCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pending Orders
                        </CardTitle>
                        <PackageOpen className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Awaiting dispatch</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Account
                        </CardTitle>
                        <User className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold truncate">{user?.email}</div>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">{user?.role?.toLowerCase()}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Links */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link
                        href="/user/orders"
                        className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors text-sm font-medium"
                    >
                        View My Orders →
                    </Link>
                    <Link
                        href="/products"
                        className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors text-sm font-medium"
                    >
                        Browse Products →
                    </Link>
                    <Link
                        href="/user/settings/profile"
                        className="px-4 py-2 rounded-lg bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 transition-colors text-sm font-medium"
                    >
                        Edit Profile →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage;

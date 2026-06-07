import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageOpen, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';

interface StatsSectionProps {
  orderCount: number;
  pendingCount: number;
  user: any;
}

const StatsSection = ({
  orderCount,
  pendingCount,
  user,
}: StatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <Link
        href="/user/orders"
        className="block transition-transform hover:-translate-y-1"
      >
        <Card className="h-full cursor-pointer border-l-4 border-l-blue-500 transition-shadow hover:shadow-lg">
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
      </Link>

      <Link
        href="/user/orders"
        className="block transition-transform hover:-translate-y-1"
      >
        <Card className="h-full cursor-pointer border-l-4 border-l-amber-500 transition-shadow hover:shadow-lg">
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
      </Link>

      <Link
        href="/user/settings/profile"
        className="block transition-transform hover:-translate-y-1"
      >
        <Card className="h-full cursor-pointer border-l-4 border-l-purple-500 transition-shadow hover:shadow-lg">
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
      </Link>
    </div>
  );
};

export default StatsSection;

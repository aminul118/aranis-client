import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IStats } from '@/types';
import {
  Banknote,
  Clock,
  FileText,
  PieChart,
  Trash2,
  UserCheck,
  UserMinus,
  Users,
} from 'lucide-react';

interface StatsProps {
  stats: IStats;
}

const Stats = ({ stats }: StatsProps) => {
  return (
    <div className="space-y-8">
      {/* E-commerce Overview */}
      <div className="space-y-4">
        <h3 className="text-foreground/80 text-lg font-semibold">
          E-commerce Overview
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-emerald-500 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Sales
              </CardTitle>
              <Banknote className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${stats.totalSales.toLocaleString()}
              </div>
              <p className="text-muted-foreground mt-1 text-xs">Lifetime revenue</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Orders
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.orderCount}</div>
              <p className="text-muted-foreground mt-1 text-xs">Orders placed</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Products
              </CardTitle>
              <FileText className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.productCount}</div>
              <p className="text-muted-foreground mt-1 text-xs">Live products</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Order Status
              </CardTitle>
              <PieChart className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500" /> Delivered
                </span>
                <span className="font-medium">
                  {stats.orderStatusDistribution.Delivered}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-yellow-500" /> Pending
                </span>
                <span className="font-medium">
                  {stats.orderStatusDistribution.Pending}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" /> Cancelled
                </span>
                <span className="font-medium">
                  {stats.orderStatusDistribution.Cancelled}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


      {/* User Detailed Stats */}
      <div className="space-y-4">
        <h3 className="text-foreground/80 text-lg font-semibold">
          User Overview
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-blue-50/50 shadow-sm transition-all hover:shadow-md dark:bg-blue-900/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-500">
                {stats.user.totalCount}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50/50 shadow-sm transition-all hover:shadow-md dark:bg-green-900/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
                Active Users
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-500">
                {stats.user.activeCount}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50/50 shadow-sm transition-all hover:shadow-md dark:bg-orange-900/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Inactive/Blocked
              </CardTitle>
              <UserMinus className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-500">
                {stats.user.inactiveCount + stats.user.blockedCount}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50/50 shadow-sm transition-all hover:shadow-md dark:bg-red-900/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
                Deleted Users
              </CardTitle>
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700 dark:text-red-500">
                {stats.user.deletedCount}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Stats;

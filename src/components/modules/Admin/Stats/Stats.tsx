'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { IStats } from '@/types';
import {
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  Box,
  Calendar,
  Clock,
  PackageSearch,
  PieChart,
  ShoppingBag,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardCharts from '../Dashboard/DashboardCharts';
import StatsSkeleton from './StatsSkeleton';

interface StatsProps {
  stats: IStats;
}

const Stats = ({ stats }: StatsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('dateFilter') || 'overall';

  if (!stats) return <StatsSkeleton />;

  const {
    totalRevenue = 0,
    totalProfit = 0,
    totalStockValue = 0,
    totalSaleValue = 0,
    lowStockCount = 0,
    restockRequestCount = 0,
    orderCount = 0,
    productCount = 0,
    orderStatusDistribution = {
      Delivered: 0,
      Pending: 0,
      Cancelled: 0,
      Processing: 0,
    },
    timeBasedOrders = { today: 0, last7Days: 0, last15Days: 0, last30Days: 0 },
    revenueTrend = [],
    user = {
      totalCount: 0,
      activeCount: 0,
      inactiveCount: 0,
      blockedCount: 0,
      deletedCount: 0,
    },
  } = stats;

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'overall') {
      params.set('dateFilter', value);
    } else {
      params.delete('dateFilter');
    }
    router.push(`?${params.toString()}`);
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleFilterChange(value);
  };

  const metrics = [
    {
      title: 'Total Revenue',
      value: `৳${totalRevenue.toLocaleString()}`,
      description: 'Gross income from sales',
      icon: Banknote,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Net Profit',
      value: `৳${totalProfit.toLocaleString()}`,
      description: 'Revenue - Cost of Goods',
      icon: TrendingUp,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Stock Requests',
      value: restockRequestCount.toLocaleString(),
      description: 'Customer restock requests',
      icon: PackageSearch,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
    {
      title: 'Potential Sales',
      value: `৳${totalSaleValue.toLocaleString()}`,
      description: 'Estimated sale revenue',
      icon: ArrowUpRight,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="mx-auto w-full space-y-10 pb-20">
      {/* Date Filter Bar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-xl sm:flex-row dark:bg-[#151722] dark:shadow-2xl">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-500" size={24} />
          <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
            Overview Dashboard
          </h2>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          {currentFilter !== 'overall' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterChange('overall')}
              className="h-11 rounded-xl px-3 font-bold text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filter
            </Button>
          )}
          <Select
            value={
              currentFilter.match(/^\d{4}-\d{2}-\d{2}$/)
                ? 'custom'
                : currentFilter
            }
            onValueChange={handleFilterChange}
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-none bg-gray-50 font-bold sm:w-[180px] dark:bg-white/5">
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">Overall (All Time)</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="3days">Last 3 Days</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="15days">Last 15 Days</SelectItem>
              <SelectItem value="1month">Last 1 Month</SelectItem>
              <SelectItem value="2month">Last 2 Months</SelectItem>
              <SelectItem value="3month">Last 3 Months</SelectItem>
              <SelectItem value="custom">Custom Date</SelectItem>
            </SelectContent>
          </Select>

          {(currentFilter === 'custom' ||
            currentFilter.match(/^\d{4}-\d{2}-\d{2}$/)) && (
            <input
              type="date"
              value={
                currentFilter.match(/^\d{4}-\d{2}-\d{2}$/) ? currentFilter : ''
              }
              onChange={handleCustomDateChange}
              className="h-11 w-full rounded-xl border-none bg-gray-50 px-4 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto dark:bg-white/5 dark:text-white"
            />
          )}
        </div>
      </div>

      {/* Prime Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card
            key={metric.title}
            className="border-none bg-white shadow-xl transition-all hover:scale-[1.02] dark:bg-[#151722] dark:shadow-2xl"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                {metric.title}
              </CardTitle>
              <div className={cn('rounded-xl p-2.5', metric.bg)}>
                <metric.icon className={cn('h-5 w-5', metric.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white">
                {metric.value}
              </div>
              <p className="text-muted-foreground mt-1 text-xs font-medium">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Order Performance (Time-based) */}
        <Card className="col-span-1 border-none bg-white shadow-xl dark:bg-[#151722] dark:shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
              <Calendar className="text-blue-500" size={20} />
              Order Velocity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10">
                <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Today
                </p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">
                  {timeBasedOrders.today}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10">
                <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  7 Days
                </p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">
                  {timeBasedOrders.last7Days}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10">
                <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  15 Days
                </p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">
                  {timeBasedOrders.last15Days}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10">
                <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  30 Days
                </p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">
                  {timeBasedOrders.last30Days}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 dark:border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2 text-sm font-bold">
                  <Clock className="text-yellow-500" size={16} /> Processing
                </span>
                <span className="text-lg font-black text-gray-900 dark:text-white">
                  {orderStatusDistribution.Processing || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2 text-sm font-bold">
                  <UserCheck className="text-blue-500" size={16} /> Active Users
                </span>
                <span className="text-lg font-black text-gray-900 dark:text-white">
                  {user.activeCount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operational Status (Pie-style bars) */}
        <Card className="col-span-1 border-none bg-white shadow-xl lg:col-span-2 dark:bg-[#151722] dark:shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
              <PieChart className="text-purple-500" size={20} />
              Status Distribution
            </CardTitle>
            {lowStockCount > 0 && (
              <div className="flex animate-pulse items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500">
                <AlertTriangle size={14} />
                {lowStockCount} Low Stock
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  label: 'Delivered',
                  count: orderStatusDistribution.Delivered,
                  color: 'bg-emerald-500',
                  total: orderCount,
                },
                {
                  label: 'Processing',
                  count: orderStatusDistribution.Processing,
                  color: 'bg-blue-500',
                  total: orderCount,
                },
                {
                  label: 'Pending',
                  count: orderStatusDistribution.Pending,
                  color: 'bg-yellow-500',
                  total: orderCount,
                },
                {
                  label: 'Cancelled',
                  count: orderStatusDistribution.Cancelled,
                  color: 'bg-red-500',
                  total: orderCount,
                },
              ].map((status) => (
                <div key={status.label} className="space-y-2">
                  <div className="flex justify-between text-sm font-black text-gray-900 dark:text-white">
                    <span>{status.label}</span>
                    <span className="text-muted-foreground">
                      {status.count}{' '}
                      <span className="text-xs font-medium">
                        ({Math.round((status.count / (orderCount || 1)) * 100)}
                        %)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
                    <div
                      className={cn(
                        'h-full transition-all duration-1000',
                        status.color,
                      )}
                      style={{
                        width: `${(status.count / (orderCount || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-blue-500" size={24} />
          <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            Strategic Analytics
          </h2>
        </div>
        <DashboardCharts revenueTrend={revenueTrend} />
      </div>

      {/* Secondary Metrics / Notifications Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card className="border-none bg-white p-6 shadow-xl dark:bg-[#151722] dark:shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-blue-500/10 p-3">
              <Box className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-black tracking-wider uppercase">
                Catalog
              </p>
              <p className="text-xl font-black text-gray-900 dark:text-white">
                {productCount} Products
              </p>
            </div>
          </div>
        </Card>
        <Card className="border-none bg-white p-6 shadow-xl dark:bg-[#151722] dark:shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-purple-500/10 p-3">
              <ShoppingBag className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-black tracking-wider uppercase">
                Volume
              </p>
              <p className="text-xl font-black text-gray-900 dark:text-white">
                {orderCount} Sales
              </p>
            </div>
          </div>
        </Card>
        <Card className="border-none bg-white p-6 shadow-xl lg:col-span-2 dark:bg-[#151722] dark:shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-orange-500/10 p-3">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-black tracking-wider uppercase">
                  Client Base
                </p>
                <p className="text-xl font-black text-gray-900 dark:text-white">
                  {user.totalCount} Registered
                </p>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-gray-100 bg-gray-200 dark:border-[#151722] dark:bg-white/10"
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Stats;

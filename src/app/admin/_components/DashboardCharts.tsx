'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DashboardChartsProps {
  revenueTrend: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

const DashboardCharts = ({ revenueTrend }: DashboardChartsProps) => {
  if (!revenueTrend || revenueTrend.length === 0) {
    return (
      <Card className="flex h-[300px] items-center justify-center border-none bg-white text-gray-500 shadow-xl dark:bg-[#151722] dark:text-white/50 dark:shadow-2xl">
        No trend data available for the last 30 days
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Revenue Trend Area Chart */}
      <Card className="overflow-hidden border-none bg-white shadow-xl dark:bg-[#151722] dark:shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
            Revenue Trend (last 30 days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#475569"
                  fontSize={12}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={12}
                  tickFormatter={(val) => `৳${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Orders Bar Chart */}
      <Card className="overflow-hidden border-none bg-white shadow-xl dark:bg-[#151722] dark:shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
            Orders Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#475569"
                  fontSize={12}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar
                  dataKey="orders"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;

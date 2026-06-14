import { Card, CardContent } from '@/components/ui/card';
import { IUser } from '@/types';
import {
  Book,
  Gift,
  Lock,
  MapPin,
  MessageSquare,
  Package,
  Palette,
  Truck,
} from 'lucide-react';
import Link from 'next/link';

const DashboardHeroLayout = ({ user }: { user: IUser }) => {
  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h1 className="text-center text-3xl font-semibold text-slate-800 sm:text-4xl dark:text-slate-100">
          Good Morning{' '}
          <span className="font-bold text-blue-600 uppercase dark:text-blue-400">
            {user?.fullName}!
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-12">
          <Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                My Orders
              </h2>
              <Link
                href="/dashboard/orders"
                className="flex items-center rounded-full border border-blue-600/30 px-3 py-1 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
              >
                See All Orders &rarr;
              </Link>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  {
                    title: 'Processing',
                    icon: Gift,
                    color: 'text-purple-500',
                    bg: 'bg-purple-100 dark:bg-purple-500/20',
                  },
                  {
                    title: 'Ready To Ship',
                    icon: Package,
                    color: 'text-teal-500',
                    bg: 'bg-teal-100 dark:bg-teal-500/20',
                  },
                  {
                    title: 'Shipped',
                    icon: Truck,
                    color: 'text-blue-500',
                    bg: 'bg-blue-100 dark:bg-blue-500/20',
                  },
                  {
                    title: 'Review',
                    icon: MessageSquare,
                    color: 'text-emerald-500',
                    bg: 'bg-emerald-100 dark:bg-emerald-500/20',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex cursor-pointer flex-col items-center rounded-xl border border-transparent p-4 text-center transition-all hover:border-slate-100 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-800/50"
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full ${item.bg} ${item.color} mb-3 transition-transform group-hover:scale-110 group-hover:shadow-sm`}
                    >
                      <item.icon size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-4 lg:hidden">
            {[
              {
                title: 'Order Tracking',
                url: '/track-order',
                desc: 'Track shipment status',
                icon: MapPin,
                color: 'text-emerald-500',
                bg: 'bg-emerald-100 dark:bg-emerald-500/20',
              },
              {
                title: 'Address Book',
                url: '/dashboard/address',
                desc: 'Manage delivery locations',
                icon: Book,
                color: 'text-blue-500',
                bg: 'bg-blue-100 dark:bg-blue-500/20',
              },
              {
                title: 'Security',
                url: '/dashboard/security',
                desc: 'Update your password',
                icon: Lock,
                color: 'text-rose-500',
                bg: 'bg-rose-100 dark:bg-rose-500/20',
              },
              {
                title: 'Appearance',
                url: '/dashboard/appearance',
                desc: 'Customize your theme',
                icon: Palette,
                color: 'text-indigo-500',
                bg: 'bg-indigo-100 dark:bg-indigo-500/20',
              },
            ].map((item, idx) => (
              <Link key={idx} href={item.url} className="outline-none">
                <Card className="group h-full cursor-pointer transition-colors hover:border-slate-300 dark:hover:border-slate-700">
                  <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
                    <div
                      className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${item.bg} ${item.color} transition-transform group-hover:scale-110`}
                    >
                      <item.icon size={22} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      {item.title}
                    </span>
                    <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="hidden grid-cols-1 gap-4 md:grid-cols-2 lg:grid">
            <Link href="/track-order" className="outline-none">
              <Card className="group h-full cursor-pointer transition-colors hover:border-slate-300 dark:hover:border-slate-700">
                <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 transition-transform group-hover:scale-110 dark:bg-emerald-500/20">
                    <MapPin size={26} strokeWidth={2.5} />
                  </div>
                  <span className="text-base font-bold text-slate-600 dark:text-slate-300">
                    Order Tracking
                  </span>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Track your current shipment status
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/address" className="outline-none">
              <Card className="group h-full cursor-pointer transition-colors hover:border-slate-300 dark:hover:border-slate-700">
                <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-500 transition-transform group-hover:scale-110 dark:bg-blue-500/20">
                    <Book size={26} strokeWidth={2.5} />
                  </div>
                  <span className="text-base font-bold text-slate-600 dark:text-slate-300">
                    Address Book
                  </span>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Manage your delivery locations
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeroLayout;

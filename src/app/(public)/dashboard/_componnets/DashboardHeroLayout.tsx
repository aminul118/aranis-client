import { Card, CardContent } from '@/components/ui/card';
import { IUser } from '@/types';
import {
  Book,
  Gift,
  Heart,
  MapPin,
  MessageSquare,
  Package,
  ShoppingBag,
  Ticket,
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
        {/* Left Column: My Orders Quick Access */}
        <div className="space-y-4 lg:col-span-5">
          <Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                My Orders
              </h2>
              <Link
                href="/dashboard/orders"
                className="flex items-center rounded-full border border-blue-600/30 px-3 py-1 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
              >
                See More &rarr;
              </Link>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-4 gap-4">
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
                    className="group flex cursor-pointer flex-col items-center text-center"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${item.bg} ${item.color} mb-2 transition-transform group-hover:scale-110`}
                    >
                      <item.icon size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="group cursor-pointer transition-colors hover:border-slate-300 dark:hover:border-slate-700">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 transition-transform group-hover:scale-110 dark:bg-emerald-500/20">
                  <MapPin size={22} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  Order Tracking
                </span>
              </CardContent>
            </Card>
            <Card className="group cursor-pointer transition-colors hover:border-slate-300 dark:hover:border-slate-700">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500 transition-transform group-hover:scale-110 dark:bg-blue-500/20">
                  <Book size={22} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  Address Book
                </span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: 3 Large Graphic Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
          <Link href="/dashboard/orders" className="group outline-none">
            <Card className="h-full overflow-hidden border-slate-200 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800">
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300 dark:from-purple-900/40 dark:to-purple-800/40">
                <ShoppingBag
                  size={56}
                  className="text-purple-500 drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  My Orders
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  All of your orders in here
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/wishlist" className="group outline-none">
            <Card className="h-full overflow-hidden border-slate-200 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800">
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-teal-100 to-teal-300 dark:from-teal-900/40 dark:to-teal-800/40">
                <Heart
                  size={56}
                  className="text-teal-600 drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Wishlist
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  All of your wishlist items in here
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/offers" className="group outline-none">
            <Card className="h-full overflow-hidden border-slate-200 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800">
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-rose-100 to-rose-300 dark:from-rose-900/40 dark:to-rose-800/40">
                <Ticket
                  size={56}
                  className="text-rose-500 drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Coupon
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  All of your coupons in here
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeroLayout;

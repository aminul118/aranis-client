import { Card, CardContent } from '@/components/ui/card';
import type { IUser } from '@/services/user/user.interface';
import {
  Book,
  Gift,
  MapPin,
  MessageSquare,
  Package,
  Truck,
} from 'lucide-react';
import Link from 'next/link';

const DashboardHeroLayout = ({ user }: { user: IUser }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Side (7 columns on large screens) */}
        <div className="space-y-6 lg:col-span-7">
          {/* My Orders Primary Card */}
          <Card className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/10 dark:bg-black">
            <div className="flex items-center justify-between p-5 pb-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                My Orders
              </h2>
              <Link
                href="/dashboard/orders"
                className="flex items-center rounded-md border border-blue-600 px-3 py-1 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
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
                  },
                  {
                    title: 'Ready To Ship',
                    icon: Package,
                    color: 'text-teal-500',
                  },
                  {
                    title: 'Shipped',
                    icon: Truck,
                    color: 'text-blue-500',
                  },
                  {
                    title: 'Review',
                    icon: MessageSquare,
                    color: 'text-emerald-500',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-3 text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/80">
                      <item.icon
                        size={26}
                        strokeWidth={2.5}
                        className={item.color}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-400 sm:text-sm dark:text-slate-400">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links (Order Tracking & Address Book) */}
          <div className="grid grid-cols-2 gap-6">
            <Link href="/track-order" className="group outline-none">
              <Card className="flex h-full flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-black">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-emerald-500 transition-transform group-hover:scale-110 dark:bg-gray-800">
                  <MapPin size={28} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-bold text-gray-500 transition-colors group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                  Order Tracking
                </span>
              </Card>
            </Link>

            <Link href="/dashboard/address" className="group outline-none">
              <Card className="flex h-full flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-black">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-blue-600 transition-transform group-hover:scale-110 dark:bg-gray-800">
                  <Book size={28} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-bold text-gray-500 transition-colors group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                  Address Book
                </span>
              </Card>
            </Link>
          </div>
        </div>

        {/* Right Side (5 columns on large screens) */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-5">
          {/* My Orders Card */}
          <Link href="/dashboard/orders" className="group block outline-none">
            <Card className="h-full overflow-hidden rounded-2xl border border-gray-100 bg-white pt-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-black">
              <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-purple-300 via-purple-400 to-purple-500">
                <Package className="h-16 w-16 text-white/50" strokeWidth={1} />
              </div>
              <div className="relative flex flex-col items-center px-2 pt-10 pb-6 text-center">
                <div className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full border-[5px] border-white bg-white shadow-sm dark:border-black dark:bg-black">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition-transform group-hover:scale-110 dark:bg-purple-900/40 dark:text-purple-400">
                    <Package size={22} strokeWidth={2.5} />
                  </div>
                </div>
                <h3 className="mb-1 text-sm font-bold text-gray-900 dark:text-white">
                  My Orders
                </h3>
                <p className="text-[10px] leading-tight text-gray-500 dark:text-gray-400">
                  All of your orders in here
                </p>
              </div>
            </Card>
          </Link>

          {/* Coupon Card */}
          <Link href="/dashboard/coupons" className="group block outline-none">
            <Card className="h-full overflow-hidden rounded-2xl border border-gray-100 bg-white pt-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-black">
              <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-pink-200 via-rose-300 to-rose-400">
                {/* Coupon percent icon placeholder */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/60"
                >
                  <line x1="19" x2="5" y1="5" y2="19" />
                  <circle cx="6.5" cy="6.5" r="2.5" />
                  <circle cx="17.5" cy="17.5" r="2.5" />
                </svg>
              </div>
              <div className="relative flex flex-col items-center px-2 pt-10 pb-6 text-center">
                <div className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full border-[5px] border-white bg-white shadow-sm dark:border-black dark:bg-black">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white transition-transform group-hover:scale-110">
                    {/* Percent icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 5 4 4" />
                      <path d="M13 7 8.7 11.3a2.83 2.83 0 0 0 0 4l.3.3" />
                      <path d="m15 15-4-4" />
                      <path d="m8.7 15.3 4.3-4.3" />
                    </svg>
                  </div>
                </div>
                <h3 className="mb-1 text-sm font-bold text-gray-900 dark:text-white">
                  Coupon
                </h3>
                <p className="text-[10px] leading-tight text-gray-500 dark:text-gray-400">
                  All of your coupons in here
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeroLayout;

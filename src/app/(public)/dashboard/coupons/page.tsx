import { getCoupons } from '@/services/coupon/coupon';
import { format } from 'date-fns';
import { Calendar, Percent, Ticket } from 'lucide-react';

const CouponsPage = async () => {
  const res = await getCoupons();
  const coupons = res?.data || [];

  if (coupons.length === 0) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
          <Ticket className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          My Coupons
        </h2>
        <p className="max-w-md text-base leading-relaxed text-gray-500 dark:text-gray-400">
          There are no coupons available for you right now. If any coupons are
          added from the admin panel they will show up here, and you will be
          able to see how much discount you can get from the coupon.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-[#0a0a0a]">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-white/10">
        <Ticket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Available Coupons
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        {coupons.map((coupon) => (
          <div
            key={coupon._id}
            className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm transition-all hover:shadow-md dark:border-blue-900/30 dark:from-blue-950/20 dark:to-[#0a0a0a]"
          >
            {/* Decorative dots */}
            <div className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full border border-blue-100 bg-white dark:border-blue-900/30 dark:bg-[#0a0a0a]" />
            <div className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full border border-blue-100 bg-white dark:border-blue-900/30 dark:bg-[#0a0a0a]" />

            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {coupon.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                    <Percent className="h-3.5 w-3.5" />
                    <span>{coupon.discount}% OFF</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800/50 dark:bg-blue-900/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Code:
                  </span>
                  <span className="rounded bg-blue-100 px-2 py-1 font-mono text-sm font-bold tracking-wider text-blue-800 select-all dark:bg-blue-900/50 dark:text-blue-300">
                    {coupon.code}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Expires: {format(new Date(coupon.expiryDate), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponsPage;

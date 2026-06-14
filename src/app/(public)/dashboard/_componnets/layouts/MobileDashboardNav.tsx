'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { userSidebarMenu } from './user-menu';

const MobileDashboardNav = () => {
  const pathname = usePathname();

  const isLinkActive = (url: string) => {
    if (url === '/dashboard') return pathname === url;
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <div className="mb-6 w-full lg:hidden">
      <div className="grid grid-cols-3 gap-3">
        {userSidebarMenu[0].menu
          .filter((item) =>
            ['Dashboard', 'My Profile', 'My Orders'].includes(item.name),
          )
          .map((item, index) => {
            const active = isLinkActive(item.url);
            return (
              <Link
                key={index}
                href={item.url}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all ${
                  active
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <item.icon className="h-6 w-6" strokeWidth={2} />
                <span className="text-center text-[11px] leading-tight font-bold tracking-wider uppercase">
                  {item.name}
                </span>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default MobileDashboardNav;

'use client';

import NotificationBell from '@/components/layouts/NotificationBell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/context/UserContext';
import { toUrlSlug } from '@/lib/url-slugs';
import { cn } from '@/lib/utils';
import { logOut } from '@/services/auth/logout';
import { getDefaultDashboardRoute } from '@/services/user/user-access';
import { IUser } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Fade as Hamburger } from 'hamburger-react';
import { ChevronDown, LayoutGrid, LogOut, User, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { NavMenu } from './nav-menu';
import NavSearch from './NavSearch';

interface MobileNavbarProps {
  user: IUser | null;
  navItems: NavMenu[];
  logo?: ReactNode;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const MobileNavbar = ({
  user,
  navItems,
  logo,
  menuOpen,
  setMenuOpen,
}: MobileNavbarProps) => {
  return (
    <div className="flex w-full flex-col lg:hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#111111] px-4 py-3">
        <div className="origin-left scale-75">{logo}</div>
        <div className="flex items-center gap-4">
          <NavSearch />
          {user && <NotificationBell user={user} />}
          <Hamburger
            toggled={menuOpen}
            toggle={setMenuOpen}
            size={20}
            color="white"
            rounded
          />
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <Mobile
            navItems={navItems}
            setMenuOpen={setMenuOpen}
            logo={logo}
            user={user}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface MobileProps {
  navItems: NavMenu[];
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  user: IUser | null;
  logo?: React.ReactNode;
}

const Mobile = ({ navItems, setMenuOpen, logo, user }: MobileProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentCategorySlug = pathSegments[0];
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const fullName =
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'User';
  const initials = fullName
    ? fullName
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const handleDashboardRedirect = () => {
    const route = getDefaultDashboardRoute(user?.role as any);
    setMenuOpen(false);
    router.push(route);
  };

  const handleLogout = async () => {
    setLoading(true);
    await logOut();
    setUser(null);
    setMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-60 bg-white transition-colors lg:hidden dark:bg-[#0a0a0a]"
    >
      <div className="flex h-full flex-col px-4 pt-4 pb-0">
        <div className="mb-8 flex items-center justify-between">
          <div className="scale-90 text-black! dark:text-white!">{logo}</div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-gray-900 dark:text-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1 overflow-y-auto pr-2">
          {navItems.map(({ title, href, subItems }) => {
            const categorySlug = toUrlSlug(title);
            const isActive =
              (href === '/' && pathname === '/') ||
              (href !== '/' && pathname.startsWith(href));
            const hasSubItems = subItems && subItems.length > 0;
            const isExpanded = expandedItem === title;

            return (
              <div key={title} className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      setExpandedItem(isExpanded ? null : title);
                    } else {
                      setMenuOpen(false);
                      router.push(href);
                    }
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all',
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5',
                  )}
                >
                  {title}
                  {hasSubItems && (
                    <ChevronDown
                      className={cn(
                        'transition-transform duration-200',
                        isExpanded ? 'rotate-180' : '-rotate-90 opacity-50',
                      )}
                      size={16}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {hasSubItems && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="ml-4 overflow-hidden"
                    >
                      <div className="mt-1 flex flex-col gap-2 border-l border-gray-100 py-2 pl-4 dark:border-white/10">
                        {subItems.map((sub) => {
                          const subCategorySlug = toUrlSlug(sub.title);
                          return (
                            <div
                              key={sub.title}
                              className="flex flex-col gap-1"
                            >
                              {sub.title && (
                                <p className="px-3 pt-1 pb-1 text-xs font-bold text-gray-900 dark:text-gray-100">
                                  {sub.title}
                                </p>
                              )}
                              <div className="flex flex-col gap-0.5">
                                {sub.items.map((item: any) => {
                                  const isObj = typeof item === 'object';
                                  const label = isObj ? item.label : item;
                                  const itemSlug = toUrlSlug(label);

                                  const itemHref = isObj
                                    ? item.url
                                    : `/${categorySlug}/${subCategorySlug}/${itemSlug}`;

                                  const isItemActive = pathname === itemHref;
                                  return (
                                    <Link
                                      key={label}
                                      href={itemHref}
                                      className={cn(
                                        'rounded-lg px-3 py-2 text-sm transition-colors',
                                        isItemActive
                                          ? 'bg-blue-50 font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                          : 'font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white',
                                      )}
                                      onClick={() => setMenuOpen(false)}
                                    >
                                      {label}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <div className="mt-2 flex flex-col gap-1 border-t border-gray-100 pt-4 dark:border-white/5">
            {[
              { title: 'Track Order', href: '/track-order' },
              { title: 'Gift Cards', href: '/gift-cards' },
              { title: 'Contacts', href: '/contact' },
              { title: 'Outlet Locations', href: '/location' },
            ].map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all',
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5',
                  )}
                >
                  {link.title}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6 pb-20 dark:border-white/5">
            {user ? (
              <div className="flex flex-col gap-4">
                {/* User Profile Card */}
                <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 p-3.5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                  <Avatar className="h-10 w-10 border border-black/5 dark:border-white/10">
                    <AvatarImage
                      src={user?.picture || './user-placeholder.jpg'}
                      alt={fullName}
                    />
                    <AvatarFallback className="bg-blue-600 text-sm font-bold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                      {fullName}
                    </span>
                    <span className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                      {user?.email}
                    </span>
                  </div>
                </div>

                {/* Action Buttons Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDashboardRedirect}
                    className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/50 py-3 text-xs font-bold text-zinc-800 transition-all hover:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:hover:bg-white/5"
                  >
                    <LayoutGrid size={14} /> Dashboard
                  </button>
                  <Link
                    href="/my-profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/50 py-3 text-xs font-bold text-zinc-800 transition-all hover:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:hover:bg-white/5"
                  >
                    <User size={14} /> Profile
                  </Link>
                </div>

                {/* Track Order & Logout Row */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-3 text-xs font-bold text-red-500 transition-all hover:bg-red-500/20 disabled:opacity-50"
                  >
                    <LogOut size={14} /> {loading ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-1 items-center justify-center rounded-2xl bg-blue-600 py-3.5 text-sm font-black tracking-widest text-white uppercase shadow-md shadow-blue-500/20 hover:bg-blue-700"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-1 items-center justify-center rounded-2xl border border-black/10 bg-white/50 py-3.5 text-sm font-black tracking-widest text-zinc-800 uppercase hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.05]"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileNavbar;

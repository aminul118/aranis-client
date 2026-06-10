'use client';

import NotificationBell from '@/components/layouts/NotificationBell';
import { toUrlSlug } from '@/lib/url-slugs';
import { cn } from '@/lib/utils';
import { IUser } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Fade as Hamburger } from 'hamburger-react';
import { ChevronDown, X } from 'lucide-react';
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
          <Mobile navItems={navItems} setMenuOpen={setMenuOpen} logo={logo} />
        )}
      </AnimatePresence>
    </div>
  );
};

interface MobileProps {
  navItems: NavMenu[];
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  logo?: React.ReactNode;
}

const Mobile = ({ navItems, setMenuOpen, logo }: MobileProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

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

          <div className="pb-20"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileNavbar;

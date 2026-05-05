'use client';

import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toUrlSlug } from '@/lib/url-slugs';
import { cn } from '@/lib/utils';
import { IUser } from '@/types';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { Fade as Hamburger } from 'hamburger-react';
import { ChevronDown, Clock, Heart, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, Suspense, useState } from 'react';
import CategoryBar from './CategoryBar';
import MainNavbar from './MainNavbar';
import NavSearch from './NavSearch';
import TopBar from './TopBar';
import { NavMenu } from './nav-menu';

interface MobileProps {
  navItems: NavMenu[];
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({
  user,
  navItems = [],
  logo,
  siteSettings,
}: {
  user: IUser | null;
  navItems?: NavMenu[];
  logo?: React.ReactNode;
  siteSettings?: any;
}) => {
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      if (!hidden) setHidden(true);
    } else {
      if (hidden) setHidden(false);
    }
    if (latest > 50) {
      if (!scrolled) setScrolled(true);
    } else {
      if (scrolled) setScrolled(false);
    }
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={cn(
        'fixed top-0 left-0 z-50 flex w-full flex-col',
        scrolled ? 'shadow-lg' : '',
      )}
    >
      <TopBar siteSettings={siteSettings} />
      <div className="hidden lg:block">
        <MainNavbar user={user} logo={logo} />
        <Suspense
          fallback={<div className="h-14 w-full bg-white dark:bg-[#0a0a0a]" />}
        >
          <CategoryBar />
        </Suspense>
      </div>

      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#111111] px-4 py-3 lg:hidden">
        <div className="origin-left scale-75">{logo}</div>
        <div className="flex items-center gap-4">
          <NavSearch />
          {user && (
            <Link href="/wishlist" className="relative text-white">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[8px]">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}
          <Link href="/cart" className="relative text-white">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 text-[8px]">
                {totalItems}
              </span>
            )}
          </Link>
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
    </motion.header>
  );
};

const Mobile = ({
  navItems,
  setMenuOpen,
  logo,
}: MobileProps & { logo?: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentCategorySlug = pathSegments[0];
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-60 bg-white transition-colors lg:hidden dark:bg-[#0a0a0a]"
    >
      <div className="flex h-full flex-col p-4">
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
            const isCategoryActive = currentCategorySlug === categorySlug;
            const isActive = pathname === href || isCategoryActive;
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
                    'flex w-full items-center justify-between rounded-xl border border-transparent px-4 py-4 text-sm font-bold tracking-widest uppercase transition-all',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:border-gray-100 hover:bg-gray-50 dark:text-gray-400 dark:hover:border-white/5 dark:hover:bg-white/5',
                  )}
                >
                  {title}
                  {hasSubItems && (
                    <ChevronDown
                      className={cn(
                        'transition-transform duration-200',
                        isExpanded ? 'rotate-180' : '-rotate-90 opacity-50',
                      )}
                      size={14}
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
                      className="ml-4 overflow-hidden rounded-xl bg-gray-50/50 dark:bg-white/5"
                    >
                      <div className="flex flex-col gap-1 p-2">
                        {subItems.map((sub) => {
                          const subCategorySlug = toUrlSlug(sub.title);
                          return (
                            <div
                              key={sub.title}
                              className="flex flex-col gap-1"
                            >
                              <p className="px-3 pt-3 pb-1 text-[10px] font-black tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                {sub.title}
                              </p>
                              <div className="flex flex-col gap-0.5">
                                {sub.items.map((item) => {
                                  const itemSlug = toUrlSlug(item);
                                  const itemHref = `/${categorySlug}/${subCategorySlug}/${itemSlug}`;
                                  return (
                                    <Link
                                      key={item}
                                      href={itemHref}
                                      className="rounded-lg px-3 py-2.5 text-xs font-bold text-gray-500 transition-colors hover:bg-white hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                                      onClick={() => setMenuOpen(false)}
                                    >
                                      {item}
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
        </div>

        <div className="mt-auto flex flex-col gap-4 border-t border-gray-100 pt-6 dark:border-white/5">
          <Link
            href="/track-order"
            className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase dark:text-gray-400"
          >
            <Clock size={16} /> Order Tracking
          </Link>
          <Link href="/login" onClick={() => setMenuOpen(false)}>
            <div className="flex w-full items-center justify-center rounded-2xl bg-[#111111] py-4 text-base font-black tracking-widest text-white uppercase">
              Login Account
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;

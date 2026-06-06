'use client';

import { useCartOptional } from '@/context/CartContext';
import { useWishlistOptional } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';
import { Gift, Heart, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getDefaultDashboardRoute } from '@/services/user/user-access';
import { IUser } from '@/types';

const MobileBottomNav = ({ user }: { user: IUser | null }) => {
  const pathname = usePathname();

  const cart = useCartOptional();
  let totalItems = cart?.totalItems || 0;

  const wishlist = useWishlistOptional();
  let wishlistCount = wishlist?.wishlistCount || 0;

  const navItems = [
    {
      label: 'OFFER',
      href: '/offers',
      icon: Gift,
      color: 'text-orange-400',
    },
    {
      label: 'WISHLIST',
      href: '/wishlist',
      icon: Heart,
      count: wishlistCount,
      badgeColor: 'bg-red-600',
    },
    {
      label: 'CART',
      href: '/cart',
      icon: ShoppingCart,
      count: totalItems,
      badgeColor: 'bg-blue-600',
    },
    {
      label: 'ACCOUNT',
      href: user ? getDefaultDashboardRoute(user.role as any) : '/login',
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-100 bg-white lg:hidden dark:border-white/5 dark:bg-[#0a0a0a]">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex min-w-[64px] flex-col items-center justify-center gap-1',
                isActive ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400',
              )}
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={cn(
                    'transition-transform duration-200',
                    isActive && 'scale-110',
                    item.color,
                  )}
                />
                {(item.count ?? 0) > 0 && (
                  <span
                    className={cn(
                      'absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white text-[8px] font-bold text-white dark:border-[#0a0a0a]',
                      item.badgeColor,
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-black tracking-tighter uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe Area Padding for mobile browsers */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
};

export default MobileBottomNav;

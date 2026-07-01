'use client';

import HeaderUser from '@/components/layouts/HeaderUser';
import NotificationBell from '@/components/layouts/NotificationBell';
import { useCartOptional } from '@/context/CartContext';
import { useWishlistOptional } from '@/context/WishlistContext';
import type { IUser } from '@/services/user/user.interface';
import { Gift, Heart, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import NavSearch from './NavSearch';

interface MainNavbarProps {
  user?: IUser | null;
  loading?: boolean;
  logo?: ReactNode;
  totalItems?: number;
  wishlistCount?: number;
}

const MainNavbar = ({
  user,
  loading,
  logo,
  totalItems: propTotalItems,
  wishlistCount: propWishlistCount,
}: MainNavbarProps) => {
  const cart = useCartOptional();
  let contextTotalItems = cart?.totalItems || 0;

  const wishlist = useWishlistOptional();
  let contextWishlistCount = wishlist?.wishlistCount || 0;

  const totalItems =
    propTotalItems !== undefined ? propTotalItems : contextTotalItems;
  const wishlistCount =
    propWishlistCount !== undefined ? propWishlistCount : contextWishlistCount;

  const pathname = usePathname();

  return (
    // ✅ Always black background (light/dark theme doesn't affect)
    <div className="w-full border-b border-white/10 bg-black py-4 text-white">
      <div className="container mx-auto flex items-center gap-4 px-4 lg:gap-8">
        {/* Logo */}
        <div className="shrink-0 origin-left scale-90 lg:scale-100">{logo}</div>

        {/* Search */}
        <NavSearch />

        {/* Action Buttons */}
        <div className="ml-auto flex items-center gap-2 lg:gap-4">
          {/* Offers */}
          <div className="relative overflow-hidden rounded-md p-[1px]">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_0%,#f97316_50%,#00000000_100%)]" />
            <Link
              href="/offers"
              className={`relative flex h-full w-full items-center gap-2 rounded-md px-4 py-2 ${
                pathname === '/offers' || pathname.startsWith('/offers?')
                  ? 'bg-black text-orange-400 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  : 'bg-black text-orange-400'
              }`}
            >
              <Gift size={18} />
              <span className="hidden text-[10px] font-black tracking-widest uppercase md:inline">
                Offers
              </span>
            </Link>
          </div>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className={`group flex items-center gap-2 rounded-md border px-4 py-2 transition-colors ${
              pathname === '/wishlist'
                ? 'border-white/50 bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                : 'border-white/20 hover:bg-white/5'
            }`}
          >
            <div className="relative">
              <Heart size={18} className="text-white" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-black bg-red-600 text-[8px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="hidden text-[10px] font-bold tracking-widest text-white uppercase lg:inline">
              Wishlist
            </span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className={`group flex items-center gap-2 rounded-md border px-4 py-2 transition-colors ${
              pathname === '/cart'
                ? 'border-white/50 bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                : 'border-white/20 hover:bg-white/5'
            }`}
          >
            <div className="relative">
              <ShoppingCart size={18} className="text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-black bg-blue-600 text-[8px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden text-[10px] font-bold tracking-widest text-white uppercase md:inline">
              Cart
            </span>
          </Link>

          {/* User / Login */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-3">
                {/* Notification skeleton */}
                <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
                {/* User avatar skeleton */}
                <div className="h-9 w-9 animate-pulse rounded-full bg-white/20" />
              </div>
            ) : user ? (
              <>
                <div className="mr-1 lg:mr-2">
                  <NotificationBell user={user} />
                </div>
                <HeaderUser user={user} />
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-md border border-white/20 bg-white px-4 py-2 transition-colors hover:bg-gray-200"
              >
                <User size={16} className="text-gray-900" />
                <span className="text-[10px] font-black tracking-widest text-gray-900 uppercase">
                  Login
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;

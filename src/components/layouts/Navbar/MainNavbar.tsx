'use client';

import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { IUser } from '@/types';
import { Heart, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import HeaderUser from '../shared/HeaderUser';
import NotificationBell from '../shared/NotificationBell';
import NavSearch from './NavSearch';

interface MainNavbarProps {
  user?: IUser | null;
  logo?: React.ReactNode;
}

const MainNavbar = ({ user, logo }: MainNavbarProps) => {
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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
          {/* Wishlist */}
          {user && (
            <Link
              href="/wishlist"
              className="group flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 transition-colors hover:bg-white/5"
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
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="group flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 transition-colors hover:bg-white/5"
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
            {user && (
              <div className="mr-2 hidden lg:block">
                <NotificationBell user={user} />
              </div>
            )}

            {user ? (
              <HeaderUser user={user} />
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

'use client';

import AminulLogo from '@/components/common/Logo';
import { useCart } from '@/context/CartContext';
import { IUser } from '@/types';
import { Clock, Gift, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import HeaderUser from '../shared/HeaderUser';
import NotificationBell from '../shared/NotificationBell';
import NavSearch from './NavSearch';

interface MainNavbarProps {
  user?: IUser | null;
  logoUrl?: string;
}

const MainNavbar = ({ user, logoUrl }: MainNavbarProps) => {
  const { totalItems } = useCart();
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
        <div className="shrink-0 origin-left scale-90 lg:scale-100">
          <AminulLogo className="text-white" logoUrl={logoUrl} />
        </div>

        {/* Search */}
        <NavSearch />

        {/* Action Buttons */}
        <div className="ml-auto flex items-center gap-2 lg:gap-4">
          {/* Offer Button */}
          <Link
            href="/shop?featured=true"
            className="group hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 transition-all hover:bg-white/10 lg:flex"
          >
            <div className="rounded-full bg-yellow-500/10 p-1 text-yellow-500 transition-transform group-hover:scale-110">
              <Gift size={14} />
            </div>
            <span className="text-[10px] font-black tracking-widest text-white uppercase italic">
              Offer
            </span>
          </Link>

          {/* Pre-Order Button */}
          <Link
            href="/pre-order"
            className="hidden items-center gap-2 rounded-md border border-white/20 px-4 py-2 transition-colors hover:bg-white/5 lg:flex"
          >
            <Clock size={16} className="text-white/70" />
            <span className="text-[10px] font-bold tracking-widest text-white uppercase">
              Pre Order
            </span>
          </Link>

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

'use client';

import HeaderUser from '@/components/layouts/HeaderUser';
import NotificationBell from '@/components/layouts/NotificationBell';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useCartOptional } from '@/context/CartContext';
import { IUser } from '@/types';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const UserHeader = ({ user }: { user: IUser }) => {
  const cartContext = useCartOptional();
  const cart = cartContext?.cart || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b px-2 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
      <div className="flex items-center gap-1 md:gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-4 md:mr-2"
        />
        <span className="text-muted-foreground hidden text-sm font-medium sm:inline">
          My Portal
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <NotificationBell user={user} />

        {/* Cart button */}
        <Link
          href="/cart"
          className="group hover:bg-accent relative flex items-center rounded-full p-2 transition-colors"
        >
          <ShoppingCart className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
          {totalItems > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </Link>

        <div className="bg-border mx-1 hidden h-6 w-px sm:block" />
        <HeaderUser user={user} portalType="user" />
      </div>
    </header>
  );
};

export default UserHeader;

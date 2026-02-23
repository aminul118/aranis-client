'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const UserHeader = () => {
    const { cart } = useCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <span className="text-sm font-medium text-muted-foreground">My Portal</span>
            </div>

            <div className="flex items-center gap-4">
                {/* Cart button */}
                <Link
                    href="/cart"
                    className="relative group hover:bg-accent p-2 rounded-full transition-colors flex items-center"
                >
                    <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    {totalItems > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                            {totalItems > 99 ? '99+' : totalItems}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
};

export default UserHeader;

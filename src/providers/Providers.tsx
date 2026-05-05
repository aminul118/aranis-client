'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';
import { WishlistProvider } from '@/context/WishlistContext';
import ThemeProvider from '@/providers/ThemeProvider';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </UserProvider>
      <Toaster position="top-right" richColors theme="dark" />
    </ThemeProvider>
  );
}

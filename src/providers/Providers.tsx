'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';
import { WishlistProvider } from '@/context/WishlistContext';
import ThemeProvider from '@/providers/ThemeProvider';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <DndProvider backend={HTML5Backend}>
        <UserProvider>
          <CartProvider>
            <WishlistProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </WishlistProvider>
          </CartProvider>
        </UserProvider>
      </DndProvider>
      <Toaster position="bottom-right" richColors theme="system" />
    </ThemeProvider>
  );
}

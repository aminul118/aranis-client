'use client';

import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';
import { IUser } from '@/types';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';
import { NavMenu } from './nav-menu';

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
  let totalItems = 0;
  try {
    const cart = useCart();
    totalItems = cart?.totalItems || 0;
  } catch (error) {
    // Safe fallback for SSR or context-less environments
  }

  let wishlistCount = 0;
  try {
    const wishlist = useWishlist();
    wishlistCount = wishlist?.wishlistCount || 0;
  } catch (error) {
    // Safe fallback for SSR or context-less environments
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

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
        'fixed top-0 left-0 z-50 flex w-full flex-col transition-all',
        menuOpen ? 'z-[100]' : '',
        scrolled ? 'shadow-lg' : '',
      )}
    >
      <DesktopNavbar
        user={user}
        logo={logo}
        siteSettings={siteSettings}
        totalItems={totalItems}
        wishlistCount={wishlistCount}
      />
      <MobileNavbar
        user={user}
        navItems={navItems}
        logo={logo}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </motion.header>
  );
};

export default Navbar;

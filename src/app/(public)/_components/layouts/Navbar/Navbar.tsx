'use client';

import { useCartOptional } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useWishlistOptional } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';
import { NavMenu } from './nav-menu';

const Navbar = ({
  navItems = [],
  activeOffers = [],
  logo,
  siteSettings,
}: {
  navItems?: NavMenu[];
  activeOffers?: any[];
  logo?: React.ReactNode;
  siteSettings?: any;
}) => {
  const { user, loading } = useUser();
  const cart = useCartOptional();
  let totalItems = cart?.totalItems || 0;

  const wishlist = useWishlistOptional();
  let wishlistCount = wishlist?.wishlistCount || 0;

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

  const rawLogo = siteSettings?.logo ? (
    <Image
      src={siteSettings.logo}
      alt="Logo"
      width={120}
      height={32}
      className="h-8 w-auto object-contain"
      priority
      fetchPriority="high"
      style={{ width: 'auto', height: 'auto' }}
    />
  ) : (
    logo
  );

  const resolvedLogo = (
    <Link
      href="/"
      className="inline-block transition-transform hover:scale-105 active:scale-95"
    >
      {rawLogo}
    </Link>
  );

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
        loading={loading}
        navItems={navItems as any}
        activeOffers={activeOffers}
        logo={resolvedLogo}
        siteSettings={siteSettings}
        totalItems={totalItems}
        wishlistCount={wishlistCount}
      />
      <MobileNavbar
        user={user}
        loading={loading}
        navItems={navItems}
        logo={resolvedLogo}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </motion.header>
  );
};

export default Navbar;

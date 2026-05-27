'use client';

import { IUser } from '@/types';
import { Suspense } from 'react';
import CategoryBar from './CategoryBar';
import MainNavbar from './MainNavbar';
import TopBar from './TopBar';

interface DesktopNavbarProps {
  user: IUser | null;
  navItems: any[];
  activeOffers: any[];
  logo?: React.ReactNode;
  siteSettings?: any;
  totalItems: number;
  wishlistCount: number;
}

const DesktopNavbar = ({
  user,
  navItems,
  activeOffers,
  logo,
  siteSettings,
  totalItems,
  wishlistCount,
}: DesktopNavbarProps) => {
  return (
    <div className="hidden w-full flex-col lg:flex">
      <TopBar siteSettings={siteSettings} />
      <MainNavbar
        user={user}
        logo={logo}
        totalItems={totalItems}
        wishlistCount={wishlistCount}
      />

      <Suspense
        fallback={<div className="h-14 w-full bg-white dark:bg-[#0a0a0a]" />}
      >
        <CategoryBar
          initialNavItems={navItems}
          initialActiveOffers={activeOffers}
        />
      </Suspense>
    </div>
  );
};

export default DesktopNavbar;

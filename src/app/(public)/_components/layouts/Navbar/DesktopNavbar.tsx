'use client';

import { IUser } from '@/types';
import { ReactNode } from 'react';
import CategoryBar from './CategoryBar';
import MainNavbar from './MainNavbar';
import TopBar from './TopBar';

interface DesktopNavbarProps {
  user: IUser | null;
  navItems: any[];
  activeOffers: any[];
  logo?: ReactNode;
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

      <CategoryBar
        initialNavItems={navItems}
        initialActiveOffers={activeOffers}
      />
    </div>
  );
};

export default DesktopNavbar;

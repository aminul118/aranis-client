'use client';

import {
  Gift,
  Headset,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type LinkItem = {
  name: string;
  href: string;
  icon?: LucideIcon;
  iconColor?: string;
};

const TopBar = ({ siteSettings }: { siteSettings?: any }) => {
  const pathname = usePathname();
  const activeOffer = siteSettings?.activeOfferTag || 'Eid offer';

  const links: LinkItem[] = [
    {
      name: activeOffer,
      href: `/offers?tag=${encodeURIComponent(activeOffer)}`,
      icon: Gift,
      iconColor: 'text-red-500',
    },
    {
      name: 'Gift Card',
      href: '/gift-cards',
      icon: Gift,
      iconColor: 'text-purple-500',
    },
    {
      name: 'Order Tracking',
      href: '/track-order',
      icon: Truck,
      iconColor: 'text-emerald-500',
    },
    {
      name: 'Contact',
      href: '/contact',
      icon: Headset,
      iconColor: 'text-blue-500',
    },
    {
      name: 'Store Location',
      href: '/location',
      icon: MapPin,
      iconColor: 'text-amber-500',
    },
  ];
  return (
    <div className="dark:bg-background hidden w-full border-b border-gray-100 bg-white py-2 transition-colors md:block dark:border-white/5">
      <div className="container mx-auto flex items-center justify-between px-4 text-[10px] font-bold tracking-wider text-gray-600 uppercase dark:text-gray-400">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <a
            href={`tel:${siteSettings?.contactNumber || '+8801886877730'}`}
            className="flex items-center gap-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Phone size={14} className="text-gray-400 dark:text-gray-600" />
            <span>{siteSettings?.contactNumber || '+880 1886-877730'}</span>
          </a>
          {siteSettings?.email && (
            <a
              href={`mailto:${siteSettings.email}`}
              className="flex items-center gap-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Mail size={14} className="text-gray-400 dark:text-gray-600" />
              <span>{siteSettings.email}</span>
            </a>
          )}
        </div>

        {/* Right Side Dynamic Links */}
        <div className="flex items-center gap-6">
          {links
            .filter((l) => l.name !== activeOffer)
            .map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                    pathname === link.href
                      ? 'text-blue-600 dark:text-blue-400'
                      : ''
                  }`}
                >
                  {Icon && (
                    <Icon
                      size={12}
                      className={`${link.iconColor} transition-transform group-hover:scale-110`}
                    />
                  )}
                  <span>{link.name}</span>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default TopBar;

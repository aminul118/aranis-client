'use client';

import { toUrlSlug } from '@/lib/url-slugs';
import { cn } from '@/lib/utils';
import { getNavbars, INavItem } from '@/services/navbar/navbar';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const CategoryBar = () => {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<INavItem[]>([]);
  const [activeOffers, setActiveOffers] = useState<any[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentCategorySlug = pathSegments[0];
  const currentSubCategorySlug = pathSegments[1];
  const currentItemSlug = pathSegments[2];

  useEffect(() => {
    const fetchNav = async () => {
      const res = await getNavbars({});
      if (res?.success) {
        const sortedItems = (res.data || []).sort(
          (a, b) => (a.order || 0) - (b.order || 0),
        );
        setNavItems(sortedItems);
      }
    };

    const fetchActiveOffers = async () => {
      // Import getOffers from offer service
      const res = await fetch('/api/v1/offers').then((r) => r.json());
      if (res?.success) {
        setActiveOffers(res.data);
      }
    };

    fetchNav();
    fetchActiveOffers();
  }, []);

  return (
    <div className="dark:bg-background relative hidden w-full overflow-visible border-b border-gray-100 bg-white transition-colors lg:block dark:border-white/5">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-1">
          {/* Category Links */}
          <div className="flex items-center">
            {navItems.map((item) => {
              const categorySlug = toUrlSlug(item.title);
              const isCategoryActive = currentCategorySlug === categorySlug;
              const hasSubItems = item.subItems && item.subItems.length > 0;

              return (
                <div
                  key={item._id}
                  className="group relative h-full"
                  onMouseEnter={() => setHoveredItem(item._id || null)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'relative flex h-full items-center gap-2 px-4 py-4 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-all',
                      isCategoryActive || hoveredItem === item._id
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-blue-600 dark:text-gray-400',
                    )}
                  >
                    <span>{item.title}</span>
                    {hasSubItems && (
                      <ChevronDown
                        size={10}
                        className={cn(
                          'ml-1 transition-transform',
                          hoveredItem === item._id && 'rotate-180',
                        )}
                      />
                    )}
                    {(isCategoryActive || hoveredItem === item._id) && (
                      <div className="absolute right-0 bottom-0 left-0 z-10 h-0.5 bg-blue-600" />
                    )}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {hasSubItems && hoveredItem === item._id && (
                    <div className="animate-in fade-in slide-in-from-top-2 dark:bg-background absolute top-full left-0 z-100 grid w-[500px] grid-cols-2 gap-8 border border-gray-100 bg-white p-6 shadow-2xl duration-200 dark:border-white/5">
                      {(item.title === 'Offers' && activeOffers.length > 0
                        ? activeOffers.map((o) => ({
                            title: o.name,
                            tag: o.tag,
                            items: [],
                          }))
                        : item.subItems || []
                      ).map((sub: any) => {
                        const subCategorySlug = sub.tag
                          ? sub.tag
                          : toUrlSlug(sub.title);
                        const isSubActive =
                          isCategoryActive &&
                          (sub.tag
                            ? pathname.includes(sub.tag)
                            : currentSubCategorySlug === subCategorySlug);

                        const TitleContent = (
                          <h3
                            className={cn(
                              'border-b pb-2 text-[11px] font-black tracking-tighter uppercase transition-colors',
                              isSubActive
                                ? 'border-blue-500 text-blue-600 dark:border-blue-400/50 dark:text-blue-400'
                                : 'border-blue-50 pb-2 text-[11px] font-black tracking-tighter text-blue-600 uppercase dark:border-blue-900/30 dark:text-blue-400',
                            )}
                          >
                            {sub.title}
                          </h3>
                        );

                        return (
                          <div
                            key={sub.tag || sub.title}
                            className="flex flex-col gap-3"
                          >
                            {sub.tag ? (
                              <Link href={`/offers?tag=${sub.tag}`}>
                                {TitleContent}
                              </Link>
                            ) : sub.href ? (
                              <Link href={sub.href}>{TitleContent}</Link>
                            ) : (
                              TitleContent
                            )}
                            <div className="flex flex-col gap-2">
                              {sub.items.map((subItem: string) => {
                                const itemSlug = toUrlSlug(subItem);
                                const isItemActive =
                                  isSubActive && currentItemSlug === itemSlug;
                                const isOffersCategory =
                                  categorySlug === 'offers';
                                const itemHref = isOffersCategory
                                  ? `/offers?tag=${encodeURIComponent(subItem)}`
                                  : `/${categorySlug}/${subCategorySlug}/${itemSlug}`;

                                return (
                                  <Link
                                    key={subItem}
                                    href={itemHref}
                                    className={cn(
                                      'text-xs font-bold transition-colors',
                                      isItemActive
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
                                    )}
                                  >
                                    {subItem}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;

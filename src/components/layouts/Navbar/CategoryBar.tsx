'use client';

import { toUrlSlug } from '@/lib/url-slugs';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const CategoryBar = ({
  initialNavItems = [],
  initialActiveOffers = [],
}: {
  initialNavItems?: any[];
  initialActiveOffers?: any[];
}) => {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<any[]>(initialNavItems);
  const [activeOffers, setActiveOffers] = useState<any[]>(initialActiveOffers);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentCategorySlug = pathSegments[0];
  const currentSubCategorySlug = pathSegments[1];
  const currentItemSlug = pathSegments[2];

  useEffect(() => {
    setNavItems(initialNavItems);
    setActiveOffers(initialActiveOffers);
  }, [initialNavItems, initialActiveOffers]);

  return (
    <div className="dark:bg-background relative hidden w-full overflow-visible border-b border-gray-100 bg-white transition-colors lg:block dark:border-white/5">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-1">
          {/* Category Links */}
          <div className="flex items-center">
            {navItems.map((item) => {
              const categorySlug = toUrlSlug(item.title);
              const isCategoryActive =
                (item.href === '/' && pathname === '/') ||
                (item.href !== '/' && pathname.startsWith(item.href));
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
                        ? 'text-blue-700 dark:text-blue-500'
                        : 'text-gray-700 hover:text-blue-700 dark:text-gray-300',
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
                  {hasSubItems &&
                    hoveredItem === item._id &&
                    (() => {
                      const subItemsData =
                        item.title === 'Offers' && activeOffers.length > 0
                          ? activeOffers.map((o) => ({
                              title: o.name,
                              tag: o.tag,
                              items: [],
                            }))
                          : item.subItems || [];

                      const totalItemsCount = subItemsData.reduce(
                        (acc: number, sub: any) =>
                          acc + (sub.items?.length || 0) + (sub.title ? 1 : 0),
                        0,
                      );

                      let gridCols = 1;
                      let menuWidth = 'w-[220px]';
                      if (totalItemsCount > 6 && totalItemsCount <= 12) {
                        gridCols = 2;
                        menuWidth = 'w-[400px]';
                      } else if (
                        totalItemsCount > 12 &&
                        totalItemsCount <= 18
                      ) {
                        gridCols = 3;
                        menuWidth = 'w-[600px]';
                      } else if (totalItemsCount > 18) {
                        gridCols = 4;
                        menuWidth = 'w-[800px]';
                      }

                      const gridClass =
                        gridCols === 1
                          ? 'grid-cols-1'
                          : gridCols === 2
                            ? 'grid-cols-2'
                            : gridCols === 3
                              ? 'grid-cols-3'
                              : 'grid-cols-4';

                      const isFlatList = subItemsData.every(
                        (sub: any) => !sub.title,
                      );
                      const allFlatItems = isFlatList
                        ? subItemsData.flatMap((sub: any) => sub.items || [])
                        : [];

                      return (
                        <div
                          className={cn(
                            'animate-in fade-in slide-in-from-top-2 dark:bg-background absolute top-full left-0 z-100 grid gap-x-8 gap-y-4 border border-gray-100 bg-white p-6 shadow-2xl duration-200 dark:border-white/5',
                            gridClass,
                            menuWidth,
                          )}
                        >
                          {isFlatList
                            ? allFlatItems.map((subItem: any, idx: number) => {
                                const isObj = typeof subItem === 'object';
                                const label = isObj ? subItem.label : subItem;
                                const itemSlug = toUrlSlug(label);
                                const isItemActive =
                                  isCategoryActive &&
                                  currentItemSlug === itemSlug;

                                let itemHref = '';
                                if (isObj) {
                                  itemHref = subItem.url;
                                } else {
                                  const isOffersCategory =
                                    categorySlug === 'offers';
                                  itemHref = isOffersCategory
                                    ? `/offers?tag=${encodeURIComponent(label)}`
                                    : `/${categorySlug}/${itemSlug}`; // Note: flat list implies no subcategory structurally, but we just use itemSlug
                                }

                                return (
                                  <Link
                                    key={label + idx}
                                    href={itemHref}
                                    className={cn(
                                      'py-1 text-xs font-bold transition-colors',
                                      isItemActive
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
                                    )}
                                  >
                                    {label}
                                  </Link>
                                );
                              })
                            : subItemsData.map((sub: any) => {
                                const subCategorySlug = sub.tag
                                  ? sub.tag
                                  : toUrlSlug(sub.title || '');
                                const isSubActive =
                                  isCategoryActive &&
                                  (sub.tag
                                    ? pathname.includes(sub.tag)
                                    : currentSubCategorySlug ===
                                      subCategorySlug);

                                const TitleContent = sub.title ? (
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
                                ) : null;

                                return (
                                  <div
                                    key={
                                      sub.tag ||
                                      sub.title ||
                                      `sub-${Math.random()}`
                                    }
                                    className="flex flex-col gap-3"
                                  >
                                    {TitleContent &&
                                      (sub.tag ? (
                                        <Link href={`/offers?tag=${sub.tag}`}>
                                          {TitleContent}
                                        </Link>
                                      ) : sub.href ? (
                                        <Link href={sub.href}>
                                          {TitleContent}
                                        </Link>
                                      ) : (
                                        TitleContent
                                      ))}
                                    <div className="flex flex-col gap-2">
                                      {sub.items?.map((subItem: any) => {
                                        const isObj =
                                          typeof subItem === 'object';
                                        const label = isObj
                                          ? subItem.label
                                          : subItem;
                                        const itemSlug = toUrlSlug(label);
                                        const isItemActive =
                                          isSubActive &&
                                          currentItemSlug === itemSlug;

                                        let itemHref = '';
                                        if (isObj) {
                                          itemHref = subItem.url;
                                        } else {
                                          const isOffersCategory =
                                            categorySlug === 'offers';
                                          itemHref = isOffersCategory
                                            ? `/offers?tag=${encodeURIComponent(label)}`
                                            : `/${categorySlug}/${subCategorySlug}/${itemSlug}`;
                                        }

                                        return (
                                          <Link
                                            key={label}
                                            href={itemHref}
                                            className={cn(
                                              'text-xs font-bold transition-colors',
                                              isItemActive
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
                                            )}
                                          >
                                            {label}
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                        </div>
                      );
                    })()}
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

'use client';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const DashboardBreadcrumb = () => {
  const path = usePathname();
  const paths = path.split('/').filter(Boolean);

  // remove first "admin" since we hardcode it
  const realPaths = paths[0] === 'admin' ? paths.slice(1) : paths;

  // middle = everything except last two
  const middlePaths = realPaths.slice(0, -2);
  // last two shown inline
  const lastTwoPaths = realPaths.slice(-2);

  const buildHref = (index: number) =>
    '/admin/' + realPaths.slice(0, index + 1).join('/');

  return (
    <Breadcrumb className="hidden lg:block">
      <BreadcrumbList>
        {/* Always start with Admin */}

        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin">Admin</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {middlePaths.length > 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:text-foreground">
                  <BreadcrumbEllipsis />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {middlePaths.map((segment, i) => {
                    return (
                      <DropdownMenuItem asChild key={segment}>
                        <Link href={buildHref(i)}>{segment}</Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}

        {lastTwoPaths.map((segment, i) => {
          const realIndex = realPaths.length - 2 + i;
          const isLast = i === lastTwoPaths.length - 1;
          return (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={buildHref(realIndex)}>{segment}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DashboardBreadcrumb;

'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { settingNavigationMenu } from './settingNavigationMenu';

const SettingsSidebar = ({ basePath = '/admin/settings' }: { basePath?: string }) => {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64">
      <nav className="space-y-2">
        {settingNavigationMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href.replace('/admin/settings', basePath);
          const href = item.href.replace('/admin/settings', basePath);

          return (
            <Link
              key={item.id}
              href={href}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-muted',
              )}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div
                  className={cn(
                    'text-xs',
                    isActive
                      ? 'text-primary-foreground/80'
                      : 'text-muted-foreground',
                  )}
                >
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SettingsSidebar;

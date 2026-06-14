import ThemeClient from '@/app/admin/settings/_components/ThemeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Appearance Settings | Aranis',
};

export default function DashboardAppearancePage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Appearance
        </h1>
        <p className="text-muted-foreground mt-1">
          Customize the theme and appearance of your dashboard.
        </p>
      </div>

      <ThemeClient />
    </div>
  );
}

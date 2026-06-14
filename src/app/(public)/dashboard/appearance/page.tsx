import ThemeClient from '@/app/admin/settings/_components/ThemeClient';
import { Palette } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Appearance Settings | Aranis',
};

export default function DashboardAppearancePage() {
  return (
    <div className="flex h-full flex-col gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-[#0a0a0a]">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-white/10">
        <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Appearance
        </h2>
      </div>

      <ThemeClient />
    </div>
  );
}

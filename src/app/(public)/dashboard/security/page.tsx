import ChangePasswordClient from '@/app/admin/settings/_components/ChangePasswordClient';
import { getMe } from '@/services/user/users';
import { Lock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Settings | Aranis',
};

export default async function DashboardSecurityPage() {
  const { data: user } = await getMe();

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-full flex-col gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-[#0a0a0a]">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-white/10">
        <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Security Settings
        </h2>
      </div>

      <ChangePasswordClient />
    </div>
  );
}

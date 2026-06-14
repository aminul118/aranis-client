import ChangePasswordClient from '@/app/admin/settings/_components/ChangePasswordClient';
import { getMe } from '@/services/user/users';
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
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Security Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Update your password and secure your account.
        </p>
      </div>

      <ChangePasswordClient />
    </div>
  );
}

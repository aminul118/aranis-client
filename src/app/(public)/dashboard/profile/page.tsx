import ProfileClient from '@/app/admin/settings/_components/profile/ProfileClient';
import { getMe } from '@/services/user/users';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile | Aranis',
};

export default async function DashboardProfilePage() {
  const { data: user } = await getMe();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          My Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information.
        </p>
      </div>

      <ProfileClient user={user} />
    </div>
  );
}

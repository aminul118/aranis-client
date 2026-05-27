import ProfileClient from '@/app/admin/settings/_components/profile/ProfileClient';
import { getMe } from '@/services/user/users';
import { Metadata } from 'next';

export default async function ProfilePage() {
  const { data: user } = await getMe();

  if (!user) {
    return null;
  }

  return <ProfileClient user={user} />;
}

export const metadata: Metadata = {
  title: 'Profile Settings | Aranis',
};

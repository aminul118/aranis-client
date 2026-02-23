import ProfileClient from '@/components/modules/Admin/settings/profile/ProfileClient';
import { getMe } from '@/services/user/users';
import { Metadata } from 'next';

export default async function ProfilePage() {
  const { data: user } = await getMe();

  if (!user) {
    return null;
  }

  return <ProfileClient user={user} />;
}

// SEO Metadata
export const metadata: Metadata = {
  title: 'Profile Settings | Md. Aminul Islam',
};

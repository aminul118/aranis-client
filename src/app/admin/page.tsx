import SetPasswordPrompt from '@/components/common/SetPasswordPrompt';
import Stats from '@/components/modules/Admin/Stats/Stats';
import GradientTitle from '@/components/ui/gradientTitle';
import { getAdminStats } from '@/services/stats/stats';
import { getMe } from '@/services/user/users';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const AdminHomePage = async () => {
  const [statsRes, userRes] = await Promise.all([getAdminStats(), getMe()]);

  const stats = statsRes?.data;
  const user = userRes?.data;

  return (
    <section className="mx-auto w-full space-y-10 px-4">
      {user && <SetPasswordPrompt user={user} />}
      <GradientTitle
        title={`Welcome back, ${user?.fullName?.split(' ')[0] || 'Admin'}`}
      />
      <Stats stats={stats} />
    </section>
  );
};

export default AdminHomePage;

// SEO
export const metadata: Metadata = {
  title: 'Dashboard | Aminul Islam',
};

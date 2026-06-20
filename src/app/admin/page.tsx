import Stats from '@/app/admin/_components/Stats';
import SetPasswordPrompt from '@/components/common/SetPasswordPrompt';
import GradientTitle from '@/components/ui/gradientTitle';
import { getAdminStats } from '@/services/stats/stats';
import { getMe } from '@/services/user/users';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const AdminHomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ dateFilter?: string }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const [statsRes, userRes] = await Promise.all([
    getAdminStats(resolvedSearchParams),
    getMe(),
  ]);

  const stats = statsRes?.data;
  const user = userRes?.data;

  return (
    <section className="mx-auto w-full space-y-10 px-4 pt-4">
      {user && <SetPasswordPrompt user={user} />}
      <GradientTitle title={`Welcome back, ${user?.fullName || 'Admin'}`} />
      <Stats stats={stats} />
    </section>
  );
};

export default AdminHomePage;

// SEO
export const metadata: Metadata = {
  title: 'Dashboard | Aranis Admin',
};

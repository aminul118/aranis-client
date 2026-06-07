import SetPasswordPrompt from '@/components/common/SetPasswordPrompt';
import { getMyOrders } from '@/services/order/order';
import { getMe } from '@/services/user/users';
import { Metadata } from 'next';
import QuickActions from './_componnets/QuickActions';
import StatsSection from './_componnets/StatsSection';
import WelcomeSection from './_componnets/WelcomeSection';

export const metadata: Metadata = { title: 'My Dashboard | Aranis' };

const UserDashboardPage = async () => {
  const { data: user } = await getMe();
  const { data: orders } = await getMyOrders({});

  const orderCount = Array.isArray(orders) ? orders.length : 0;
  const pendingCount = Array.isArray(orders)
    ? orders.filter((o) => o.status === 'Pending').length
    : 0;

  return (
    <div className="container mx-auto space-y-8 px-6 py-8">
      {user && <SetPasswordPrompt user={user} />}

      <WelcomeSection user={user} />

      <StatsSection
        orderCount={orderCount}
        pendingCount={pendingCount}
        user={user}
      />

      <QuickActions />
    </div>
  );
};

export default UserDashboardPage;

import SetPasswordPrompt from '@/components/common/SetPasswordPrompt';
import { getMyOrders } from '@/services/order/order';
import { getMe } from '@/services/user/users';
import { Metadata } from 'next';
import DashboardHeroLayout from './_componnets/DashboardHeroLayout';
import RecentOrdersTable from './_componnets/RecentOrdersTable';

export const metadata: Metadata = { title: 'My Dashboard | Aranis' };

const UserDashboardPage = async () => {
  const { data: user } = await getMe();
  const { data: orders } = await getMyOrders({});

  const orderList = Array.isArray(orders) ? orders : [];

  return (
    <div className="flex flex-col space-y-8">
      {user && <SetPasswordPrompt user={user} />}

      {user && <DashboardHeroLayout user={user} />}

      <RecentOrdersTable orders={orderList} />
    </div>
  );
};

export default UserDashboardPage;

import CouponModal from '@/app/(dashboard)/admin/coupons/_components/CouponModal';
import CouponsTable from '@/app/(dashboard)/admin/coupons/_components/CouponsTable';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getCoupons } from '@/services/coupon/coupon';
import { SearchParams } from '@/types';
import { Metadata } from 'next';

const AdminCouponsPage = async ({ searchParams }: SearchParams) => {
  const params = await cleanSearchParams(searchParams);
  const { data, meta } = await getCoupons(params);

  return (
    <ClientTableWrapper
      tableTitle="Coupon Management"
      description="Manage discounts and promotional codes."
      meta={meta}
      action={<CouponModal />}
    >
      <CouponsTable coupons={data || []} />
    </ClientTableWrapper>
  );
};

export default AdminCouponsPage;

export const metadata: Metadata = {
  title: 'Coupons | Admin Portal',
};

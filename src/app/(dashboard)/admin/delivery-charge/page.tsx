import { getDeliveryCharge } from '@/services/delivery-charge/delivery-charge';
import { Metadata } from 'next';
import { logger } from '../../../../lib/logger';
import DeliveryChargeForm from './_components/DeliveryChargeForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Delivery Charge Settings | Admin Portal',
};

export default async function DeliveryChargePage() {
  let initialData = null;
  try {
    const res = await getDeliveryCharge();
    if (res.success && res.data) {
      initialData = res.data;
    }
  } catch (error) {
    logger.error('Failed to load delivery settings', error);
  }

  return <DeliveryChargeForm initialData={initialData} />;
}

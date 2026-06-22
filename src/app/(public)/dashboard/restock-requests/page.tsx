import cleanSearchParams from '@/lib/cleanSearchParams';
import { getMyRestockRequests } from '@/services/restock/restock';
import type { IRestockRequest } from '@/services/restock/restock.interface';
import { SearchParams } from '@/types';
import { logger } from '../../../../lib/logger';
import RestockRequestsList from './_components/RestockRequestsList';

export const metadata = {
  title: 'Restock Requests | Dashboard',
  description: 'View your restock requests',
};

const RestockRequestsPage = async ({ searchParams }: SearchParams) => {
  const resolvedParams = await cleanSearchParams(searchParams);
  let requests: IRestockRequest[] = [];
  try {
    const res = await getMyRestockRequests(resolvedParams);
    if (res.success) {
      requests = res.data || [];
    }
  } catch (error) {
    logger.error('Failed to fetch restock requests', error);
  }

  return <RestockRequestsList requests={requests} />;
};

export default RestockRequestsPage;

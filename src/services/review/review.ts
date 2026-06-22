'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { IReview } from '@/services/review/review.interface';
import { ApiResponse } from '@/types';

const getProductReviews = async (productId: string) => {
  return await serverFetch.get<ApiResponse<IReview[]>>(`/reviews/${productId}`);
};

const createReview = async (payload: {
  product: string;
  rating: number;
  comment: string;
}) => {
  const res = await serverFetch.post<ApiResponse<IReview>>('/reviews', {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  revalidate('product');
  return res;
};

const checkReviewEligibility = async (productId: string) => {
  return await serverFetch.get<ApiResponse<{ eligible: boolean }>>(
    `/reviews/check-eligibility/${productId}`,
  );
};

const deleteReviewBulk = async (ids: string[]) => {
  const res = await serverFetch.delete<ApiResponse<any>>(
    '/reviews/bulk-delete',
    {
      body: JSON.stringify({ ids }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  revalidate('product');
  return res;
};

export {
  checkReviewEligibility,
  createReview,
  deleteReviewBulk,
  getProductReviews,
};

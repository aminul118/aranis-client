'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export interface IReview {
  _id?: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    image?: string;
  };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

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

export { checkReviewEligibility, createReview, getProductReviews };

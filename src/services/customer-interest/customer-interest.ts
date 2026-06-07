'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';

export interface ICustomerInterestItem {
  _id: string;
  name: string;
  articleNo: string;
  slug: string;
  thumbnails: string[];
  price: number;
  salePrice: number;
  stock: number;
  cartCount: number;
  wishlistCount: number;
  totalInterest: number;
}

const getCustomerInterestStats = async (query?: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<ICustomerInterestItem[]>>(
    '/stats/customer-interest',
    {
      query,
      cache: 'no-store',
    },
  );
};

export interface IProductInterestUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  image?: string;
  role: string;
  inCart: boolean;
  inWishlist: boolean;
}

const getProductInterestUsers = async (productId: string) => {
  return await serverFetch.get<ApiResponse<IProductInterestUser[]>>(
    `/stats/customer-interest/${productId}/users`,
    {
      cache: 'no-store',
    },
  );
};

export { getCustomerInterestStats, getProductInterestUsers };

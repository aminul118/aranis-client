import serverFetch from '@/lib/server-fetch';
import type { ISizeGuide } from '@/services/size-guide/size-guide.interface';
import { ApiResponse } from '@/types';

export const createSizeGuide = async (
  payload: Partial<ISizeGuide>,
): Promise<ApiResponse<ISizeGuide>> => {
  const res = await serverFetch.post<ApiResponse<ISizeGuide>>('/size-guides', {
    body: JSON.stringify(payload),
  });
  return res;
};

export const getAllSizeGuides = async (
  params?: Record<string, any>,
): Promise<ApiResponse<ISizeGuide[]>> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const res = await serverFetch.get<ApiResponse<ISizeGuide[]>>(
    `/size-guides?${queryParams}`,
    {
      cache: 'no-store',
    },
  );
  return res;
};

export const getSingleSizeGuide = async (
  id: string,
): Promise<ApiResponse<ISizeGuide>> => {
  const res = await serverFetch.get<ApiResponse<ISizeGuide>>(
    `/size-guides/${id}`,
  );
  return res;
};

export const updateSizeGuide = async (
  payload: Partial<ISizeGuide>,
  id: string,
): Promise<ApiResponse<ISizeGuide>> => {
  const res = await serverFetch.patch<ApiResponse<ISizeGuide>>(
    `/size-guides/${id}`,
    {
      body: JSON.stringify(payload),
    },
  );
  return res;
};

export const deleteSizeGuide = async (
  id: string,
): Promise<ApiResponse<ISizeGuide>> => {
  const res = await serverFetch.delete<ApiResponse<ISizeGuide>>(
    `/size-guides/${id}`,
  );
  return res;
};

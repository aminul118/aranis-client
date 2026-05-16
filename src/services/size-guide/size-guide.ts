import envVars from '@/config/env.config';
import { ApiResponse, ISizeGuide } from '@/types';

export const createSizeGuide = async (
  payload: Partial<ISizeGuide>,
): Promise<ApiResponse<ISizeGuide>> => {
  const res = await fetch(`${envVars.baseUrl}/size-guides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const getAllSizeGuides = async (
  params?: Record<string, any>,
): Promise<ApiResponse<ISizeGuide[]>> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const res = await fetch(`${envVars.baseUrl}/size-guides?${queryParams}`, {
    cache: 'no-store',
  });
  return res.json();
};

export const getSingleSizeGuide = async (
  id: string,
): Promise<ApiResponse<ISizeGuide>> => {
  const res = await fetch(`${envVars.baseUrl}/size-guides/${id}`);
  return res.json();
};

export const updateSizeGuide = async (
  payload: Partial<ISizeGuide>,
  id: string,
): Promise<ApiResponse<ISizeGuide>> => {
  const res = await fetch(`${envVars.baseUrl}/size-guides/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteSizeGuide = async (
  id: string,
): Promise<ApiResponse<ISizeGuide>> => {
  const res = await fetch(`${envVars.baseUrl}/size-guides/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};

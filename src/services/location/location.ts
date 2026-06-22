'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { ILocation } from '@/services/location/location.interface';
import { ApiResponse } from '@/types';

const createLocation = async (payload: ILocation) => {
  const res = await serverFetch.post<ApiResponse<ILocation>>('/locations', {
    body: JSON.stringify(payload),
  });
  revalidate('locations');
  return res;
};

const getAllLocations = async (query?: string) => {
  return await serverFetch.get<ApiResponse<ILocation[]>>(
    `/locations${query ? `?${query}` : ''}`,
    {
      next: {
        tags: ['locations'],
      },
    },
  );
};

const getSingleLocation = async (id: string) => {
  return await serverFetch.get<ApiResponse<ILocation>>(`/locations/${id}`, {
    next: {
      tags: [`location-${id}`],
    },
  });
};

const updateLocation = async (id: string, payload: Partial<ILocation>) => {
  const res = await serverFetch.patch<ApiResponse<ILocation>>(
    `/locations/${id}`,
    {
      body: JSON.stringify(payload),
    },
  );
  revalidate('locations');
  revalidate(`location-${id}`);
  return res;
};

const deleteLocation = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<null>>(`/locations/${id}`);
  revalidate('locations');
  return res;
};

const deleteLocationBulk = async (ids: string[]) => {
  const res = await serverFetch.delete<ApiResponse<null>>('/locations', {
    body: JSON.stringify({ ids }),
  });
  revalidate('locations');
  return res;
};

export {
  createLocation,
  deleteLocation,
  deleteLocationBulk,
  getAllLocations,
  getSingleLocation,
  updateLocation,
};

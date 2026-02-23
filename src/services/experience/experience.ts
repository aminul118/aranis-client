'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';
import { IExperience } from '@/types/api.types';

const addExperience = async (payload: Record<string, string>) => {
  const res = await serverFetch.post<ApiResponse<IExperience>>('/experience', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  revalidate('experience');

  return res;
};

const updateExperience = async (
  payload: Record<string, string>,
  id: string,
) => {
  const res = await serverFetch.put<ApiResponse<IExperience>>(
    `/experience/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  revalidate('experience');

  return res;
};

const getExperience = async (query?: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<IExperience[]>>('/experience', {
    query,
    cache: 'force-cache',
    next: {
      tags: ['experience'],
    },
  });
};

const deleteSingleExperience = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<IExperience>>(
    `/experience/${id}`,
  );
  revalidate('experience');
  return res;
};

export {
  addExperience,
  deleteSingleExperience,
  getExperience,
  updateExperience,
};

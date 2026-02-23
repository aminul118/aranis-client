'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse, IProject } from '@/types';
import { revalidateTag } from 'next/cache';

const createProject = async (formData: FormData) => {
  const body = new FormData();

  body.append('data', formData.get('data') as string);

  const thumbnail = formData.get('thumbnail');

  if (thumbnail instanceof File) {
    body.append('thumbnail', thumbnail);
  }

  const photos = formData.getAll('photos');

  photos.forEach((photo) => {
    if (photo instanceof File) {
      body.append('photos', photo);
    }
  });

  const res = await serverFetch.post<ApiResponse<IProject>>('/projects', {
    body,
  });
  revalidate('projects');
  return res;
};

const updateProject = async (formData: FormData, id: string) => {
  const body = new FormData();

  body.append('data', formData.get('data') as string);

  const thumbnail = formData.get('thumbnail');
  if (thumbnail instanceof File && thumbnail.size > 0) {
    body.append('thumbnail', thumbnail);
  }

  // Forward gallery photos
  const photos = formData.getAll('photos');
  photos.forEach((photo) => {
    if (photo instanceof File && photo.size > 0) {
      body.append('photos', photo);
    }
  });

  const res = await serverFetch.put<ApiResponse<IProject>>(`/projects/${id}`, {
    body,
  });

  revalidate('projects');
  return res;
};

const getSingleProject = async (id: string) => {
  return await serverFetch.get<ApiResponse<IProject>>(`/projects/${id}`, {
    cache: 'no-store',
  });
};

const deleteSingleProject = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<IProject>>(
    `/projects/${id}`,
  );
  revalidateTag('projects', 'max');
  return res;
};

const getProjects = async (query?: Record<string, any>) => {
  return await serverFetch.get<ApiResponse<IProject[]>>('/projects', {
    query,
    cache: 'force-cache',
    next: {
      tags: ['projects'],
    },
  });
};

export {
  createProject,
  deleteSingleProject,
  getProjects,
  getSingleProject,
  updateProject,
};

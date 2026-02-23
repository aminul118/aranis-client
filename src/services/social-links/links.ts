'use server';

import serverFetch from '@/lib/server-fetch';
import { ApiResponse } from '@/types';
import { revalidateTag } from 'next/cache';

export interface ILinks {
  _id: string;
  facebook: string;
  linkedIn: string;
  github: string;
  telegram: string;
  whatsapp: string;
  resume: string;
  createdAt: Date;
  updatedAt: Date;
}

const getLinks = async () => {
  return await serverFetch.get<ApiResponse<ILinks>>(`/links`, {
    cache: 'force-cache',
    next: {
      tags: ['LINKS'],
    },
  });
};

const updateLinks = async (linksData: FormData, id: string) => {
  console.log(id);
  const payload = {
    facebook: linksData.get('facebook')?.toString() || '',
    linkedIn: linksData.get('linkedIn')?.toString() || '',
    github: linksData.get('github')?.toString() || '',
    telegram: linksData.get('telegram')?.toString() || '',
    whatsapp: linksData.get('whatsapp')?.toString() || '',
    resume: linksData.get('resume')?.toString() || '',
  };

  const data = await serverFetch.post<ApiResponse<ILinks>>(`/links/${id}`, {
    body: JSON.stringify(payload),
  });

  revalidateTag('LINKS', 'max');

  return { data };
};

export { getLinks, updateLinks };

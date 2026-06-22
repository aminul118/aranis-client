'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import type { ISiteSetting } from '@/services/settings/settings.interface';
import { ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { logger } from '../../lib/logger';

const getSiteSettings = async () => {
  return await serverFetch.get<ApiResponse<ISiteSetting>>('/site-settings', {
    cache: 'force-cache',
    next: {
      tags: ['site-settings'],
    },
  });
};

const updateSiteSettings = async (
  payload: Partial<ISiteSetting> | FormData,
) => {
  const isFormData = payload instanceof FormData;

  // eslint-disable-next-line no-console
  logger.info(
    'UPDATE SITE SETTINGS ACTION RECEIVED:',
    isFormData ? 'FormData Object' : payload,
  );

  const res = await serverFetch.patch<ApiResponse<ISiteSetting>>(
    '/site-settings',
    {
      body: isFormData ? payload : JSON.stringify(payload),
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    },
  );
  await revalidate('site-settings');
  revalidatePath('/', 'layout');
  return res;
};

export { getSiteSettings, updateSiteSettings };

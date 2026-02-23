/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import baseCookieOption from '@/config/cookie.config';
import envVars from '@/config/env.config';
import serverFetch from '@/lib/server-fetch';
import { ActionError } from '@/lib/serverResponse';
import { cookies } from 'next/headers';

const resetPassword = async (formData: FormData, id: string, token: string) => {
  try {
    const payload = {
      id,
      token,
      newPassword: formData.get('newPassword'),
    };
    console.log(payload);
    const res = await serverFetch.post('/auth/reset-password', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const cookieStore = cookies();

    (await cookieStore).set('accessToken', token, {
      ...baseCookieOption,
      maxAge: Number(envVars.jwt.accessTokenMaxAge),
    });
    return res;
  } catch (error: any) {
    ActionError(false, null, error.message);
  }
};

export { resetPassword };

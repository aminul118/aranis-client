'use server';

import { revalidate } from '@/lib/revalidate';
import { removeAccessToken, removeRefreshToken } from './cookie-token';

const logOut = async () => {
  await removeAccessToken();
  await removeRefreshToken();

  revalidate('ME');

  return {
    success: true,
    message: 'Logged out successfully',
  };
};

export { logOut };

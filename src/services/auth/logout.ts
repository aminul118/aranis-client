'use server';

import { removeAccessToken, removeRefreshToken } from './cookie-token';

const logOut = async () => {
  await removeAccessToken();
  await removeRefreshToken();

  return {
    success: true,
    message: 'Logged out successfully',
  };
};

export { logOut };

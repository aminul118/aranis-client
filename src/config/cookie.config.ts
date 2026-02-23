import envVars from './env.config';

const baseCookieOption = {
  httpOnly: true,
  secure: envVars.nodeEnv === 'production',
  sameSite: 'lax',
  domain: envVars.nodeEnv === 'production' ? '.aminuldev.site' : 'localhost',
  path: '/',
} as const;

export default baseCookieOption;

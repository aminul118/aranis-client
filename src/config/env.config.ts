const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
const nodeEnv = process.env.NODE_ENV;
const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN as string;
const accessSecret = process.env.JWT_ACCESS_SECRET as string;
const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
const accessTokenMaxAge = parseInt(process.env.JWT_ACCESS_EXPIRES as string);
const refreshTokenMaxAge = parseInt(process.env.JWT_REFRESH_EXPIRES as string);
const googleAnalytics = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as string;
const googleTagManagerId = process.env
  .NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID as string;

const envVars = {
  nodeEnv,
  baseUrl,
  domain,
  jwt: {
    accessSecret,
    refreshSecret,
    accessTokenMaxAge,
    refreshTokenMaxAge,
  },
  analytics: {
    googleAnalytics,
    googleTagManagerId,
  },
  r2: {
    accountId: process.env.R2_ACCOUNT_ID as string,
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
    bucketName: process.env.R2_BUCKET_NAME as string,
    publicDevUrl: process.env.R2_PUBLIC_DEV_URL as string,
  },
};

export default envVars;

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
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    apiSecret: process.env.CLOUDINARY_API_SECRET as string,
  },
};

export default envVars;

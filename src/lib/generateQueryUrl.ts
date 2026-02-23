import envVars from '@/config/env.config';

const generateQueryUrl = (endpoint: string, query?: Record<string, string>) => {
  const url = new URL(`${envVars.baseUrl}${endpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        value !== 'undefined' &&
        value !== 'null'
      ) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

export default generateQueryUrl;

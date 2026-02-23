import serverFetchHelper, { FetchOptions } from '@/helpers/serverFetchHelper';

const serverFetch = {
  get: <T>(endpoint: string, options: FetchOptions = {}) =>
    serverFetchHelper<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, options: FetchOptions = {}) =>
    serverFetchHelper<T>(endpoint, { ...options, method: 'POST' }),

  put: <T>(endpoint: string, options: FetchOptions = {}) =>
    serverFetchHelper<T>(endpoint, { ...options, method: 'PUT' }),

  patch: <T>(endpoint: string, options: FetchOptions = {}) =>
    serverFetchHelper<T>(endpoint, { ...options, method: 'PATCH' }),

  delete: <T>(endpoint: string, options: FetchOptions = {}) =>
    serverFetchHelper<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default serverFetch;

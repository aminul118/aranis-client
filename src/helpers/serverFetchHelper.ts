'use server';

import generateQueryUrl from '@/lib/generateQueryUrl';
import { getCookie } from '@/lib/jwt';
import { logger } from '@/lib/logger';

export type FetchOptions = RequestInit & {
  query?: Record<string, string>;
  skipAuth?: boolean;
};

const serverFetchHelper = async <T>(
  endpoint: string,
  options: FetchOptions,
): Promise<T> => {
  const { headers, query, skipAuth, ...rest } = options;
  const url = generateQueryUrl(endpoint, query);

  const makeRequest = async () => {
    // If the request is highly cached, explicitly opting out of auth prevents
    // Next.js from calling cookies() and dynamically rendering the entire page.
    const shouldSkipAuth =
      skipAuth ||
      rest.cache === 'force-cache' ||
      typeof rest.next?.revalidate === 'number';

    let accessToken: string | null = null;
    if (!shouldSkipAuth) {
      accessToken = await getCookie('accessToken');
    }

    const finalHeaders: any = {
      ...(accessToken
        ? {
            Cookie: `accessToken=${accessToken}`,
            Authorization: accessToken,
          }
        : {}),
      ...headers,
    };

    // Automatically set Content-Type to application/json if body is present and not FormData
    if (rest.body && !(rest.body instanceof FormData)) {
      finalHeaders['Content-Type'] = 'application/json';
    }

    // If the body is FormData, let fetch handle the Content-Type (with boundary)
    if (rest.body instanceof FormData) {
      delete finalHeaders['Content-Type'];
      delete finalHeaders['content-type'];
    }

    return fetch(url, {
      headers: finalHeaders,
      ...rest,
    });
  };

  // 1) Make request
  try {
    const res = await makeRequest();

    const contentType = res.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!res.ok) {
      if (isJson) {
        const errorData = await res.json();
        return errorData as T;
      }

      let errorMessage = 'An unexpected error occurred. Please try again.';
      switch (res.status) {
        case 500:
          errorMessage = 'Internal Server Error. Please try again later.';
          break;
        case 502:
          errorMessage =
            'Server is temporarily unavailable. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service is unavailable. Please try again later.';
          break;
        case 504:
          errorMessage = 'Server timeout. Please try again later.';
          break;
        case 404:
          errorMessage = 'Requested resource not found.';
          break;
        default:
          errorMessage = `Request failed (Status: ${res.status}). Please try again.`;
      }

      throw new Error(errorMessage);
    }

    if (isJson) {
      return (await res.json()) as T;
    }

    return {
      success: true,
      message: 'Success',
      data: null,
    } as any as T;
  } catch (error: any) {
    logger.error('Fetch Error Detail:', {
      url,
      method: options.method,
      message: error?.message || 'No message available',
      error: error,
    });
    return {
      success: false,
      message: error?.message || 'Something went wrong',
      statusCode: error?.status || 500,
    } as T;
  }
};

export default serverFetchHelper;

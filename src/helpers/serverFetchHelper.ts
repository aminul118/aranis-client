'use server';

import generateQueryUrl from '@/lib/generateQueryUrl';
import { getCookie } from '@/lib/jwt';

export type FetchOptions = RequestInit & {
  query?: Record<string, string>;
};

const serverFetchHelper = async <T>(
  endpoint: string,
  options: FetchOptions,
): Promise<T> => {
  const { headers, query, ...rest } = options;
  const url = generateQueryUrl(endpoint, query);

  const makeRequest = async () => {
    const accessToken = await getCookie('accessToken');

    const finalHeaders: any = {
      ...(accessToken
        ? {
            Cookie: `accessToken=${accessToken}`,
            Authorization: accessToken,
          }
        : {}),
      ...headers,
    };

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
    console.error('Fetch Error Detail:', {
      url,
      method: options.method,
      error: error.message,
    });
    return {
      success: false,
      message: error.message || 'Something went wrong',
      statusCode: error.status || 500,
    } as T;
  }
};

export default serverFetchHelper;

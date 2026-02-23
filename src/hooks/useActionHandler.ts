'use client';

import { logger } from '@/lib/logger';
import { ApiResponse } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface SuccessConfig<T> {
  loadingText?: string;
  message?: string;
  redirectPath?: string;
  cleanUrl?: boolean;
  isRefresh?: boolean;
  onSuccess?: (data?: T) => void;
}

interface ExecuteOptions<T> {
  action: () => Promise<ApiResponse<T>>;
  success?: SuccessConfig<T>;
  errorMessage?: string;
}

const useActionHandler = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const executePost = async <T>({
    action,
    success,
    errorMessage = 'Something went wrong',
  }: ExecuteOptions<T>): Promise<boolean> => {
    if (isPending) return false; //  prevent double click

    setIsPending(true);
    const toastId = toast.loading(success?.loadingText || 'Processing...');

    try {
      const res = await action();

      logger.info('API RESPONSE:', res);

      if (res?.success) {
        toast.success(res.message || success?.message || 'Success', {
          id: toastId,
        });

        success?.onSuccess?.(res.data);

        if (success?.redirectPath) {
          success.cleanUrl
            ? router.replace(success.redirectPath)
            : router.push(success.redirectPath);
        }

        if (success?.isRefresh) {
          router.refresh();
        }

        return true;
      }

      toast.error(res?.message || errorMessage, { id: toastId });
      return false;
    } catch (error: unknown) {
      logger.error('ACTION ERROR:', error);

      toast.error(error instanceof Error ? error.message : errorMessage, {
        id: toastId,
      });
      return false;
    } finally {
      setIsPending(false); //  always reset
    }
  };

  return { executePost, isPending };
};

export default useActionHandler;

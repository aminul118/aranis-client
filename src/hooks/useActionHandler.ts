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

      if (
        res?.errorSources &&
        Array.isArray(res.errorSources) &&
        res.errorSources.length > 0
      ) {
        // Create a more readable error message
        const errorMessages = res.errorSources.map((e: any) => e.message);

        // If multiple errors, show them as a bulleted list or just the first few
        if (errorMessages.length > 1) {
          const limit = 5;
          const showList = errorMessages.slice(0, limit).join('\n• ');
          const remaining =
            errorMessages.length > limit
              ? `\n...and ${errorMessages.length - limit} more`
              : '';
          toast.error(
            `Please correct the following:\n• ${showList}${remaining}`,
            {
              id: toastId,
              duration: 6000,
            },
          );
        } else {
          toast.error(errorMessages[0], { id: toastId });
        }
      } else {
        toast.error(res?.message || errorMessage, { id: toastId });
      }
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

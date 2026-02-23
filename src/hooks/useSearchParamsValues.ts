import { useSearchParams } from 'next/navigation';

const useSearchParamsValues = <T extends string>(
  ...keys: T[]
): { [K in T]: string | null } => {
  const searchParams = useSearchParams();

  const result = {} as { [K in T]: string | null };

  keys.forEach((key) => {
    result[key] = searchParams.get(key);
  });

  return result;
};

export default useSearchParamsValues;

/**
 * -----------------------------------------------------------
 *                         Use Process
 * -----------------------------------------------------------
 *   const { page, limit } = useSearchParamsValues("page", "limit");
 */

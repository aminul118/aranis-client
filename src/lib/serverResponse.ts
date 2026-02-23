export interface ServerResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}

export const ActionError = <T>(
  success: boolean,
  data: T | null,
  message: string,
): ServerResponse<T> => {
  return {
    success,
    data,
    message,
  };
};

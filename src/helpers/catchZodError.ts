import { ZodSchema } from 'zod';

const catchZodError = <T>(
  zodSchema: ZodSchema<T>,
  payload: unknown,
):
  | { success: false; errors: { field: string; message: string }[] }
  | { success: true; data: T } => {
  const result = zodSchema.safeParse(payload);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => ({
        field: String(issue.path[0]),
        message: issue.message,
      })),
    };
  }

  return { success: true, data: result.data };
};

export default catchZodError;

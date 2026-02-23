import z from 'zod';

export const experienceValidationSchema = z.object({
  position: z
    .string()
    .min(2, { message: 'Position must be at least 2 characters.' }),
  companyName: z
    .string()
    .min(2, { message: 'Company name must be at least 2 characters.' }),
  timeline: z
    .string()
    .min(2, { message: 'Timeline must be at least 2 characters.' }),
  description: z
    .string()
    .min(6, { message: 'Description must be at least 6 characters.' }),
});

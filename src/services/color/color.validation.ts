import { z } from 'zod';

export const colorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  hex: z.string().optional().or(z.literal('')),
});

export const addColorSchema = colorSchema;
export const updateColorSchema = colorSchema.partial();

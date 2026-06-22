import { z } from 'zod';

export const subCategorySchema = z.object({
  title: z.string().optional().or(z.literal('')),
  items: z.preprocess((val) => {
    if (!val) return [];
    if (typeof val === 'string')
      return val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    return val;
  }, z.array(z.string()).default([])),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subCategories: z.array(subCategorySchema).default([]),
});

export const addCategorySchema = categorySchema;
export const updateCategorySchema = categorySchema.partial();

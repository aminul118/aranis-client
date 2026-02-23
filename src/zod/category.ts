import { z } from 'zod';

export const subCategorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  items: z.preprocess(
    (val) =>
      typeof val === 'string' ? val.split(',').map((s) => s.trim()) : val,
    z.array(z.string()).min(1, 'At least one item is required'),
  ),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subCategories: z.array(subCategorySchema).default([]),
  colors: z.preprocess(
    (val) =>
      typeof val === 'string' ? val.split(',').map((s) => s.trim()) : val,
    z.array(z.string()).default([]),
  ),
  sizes: z.preprocess(
    (val) =>
      typeof val === 'string' ? val.split(',').map((s) => s.trim()) : val,
    z.array(z.string()).default([]),
  ),
});

export const addCategorySchema = categorySchema;
export const updateCategorySchema = categorySchema.partial();

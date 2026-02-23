import { z } from 'zod';

export const navSubItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  href: z.string().min(1, 'Href is required'),
  items: z.union([z.string(), z.array(z.string())]),
});

export const addNavItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  href: z.string().min(1, 'Href is required'),
  subItems: z.array(navSubItemSchema),
  order: z.coerce.number().default(0),
});

export const updateNavItemSchema = addNavItemSchema.partial();

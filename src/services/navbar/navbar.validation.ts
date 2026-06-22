import { z } from 'zod';

export const navItemLinkSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  url: z.string().min(1, 'URL is required'),
});

export const navSubItemSchema = z.object({
  title: z.string().optional().or(z.literal('')),
  href: z.string().optional().or(z.literal('')),
  items: z.array(navItemLinkSchema),
});

export const addNavItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  href: z.string().min(1, 'Href is required'),
  subItems: z.array(navSubItemSchema),
  order: z.coerce.number().default(0),
});

export const updateNavItemSchema = addNavItemSchema.partial();

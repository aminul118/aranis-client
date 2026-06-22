import { z } from 'zod';

export const popupBannerSchema = z.object({
  image: z.any().refine((val) => val, 'Image is required'),
  link: z.string().optional().or(z.literal('')),
  title: z.string().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

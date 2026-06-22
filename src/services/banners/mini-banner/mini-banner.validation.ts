import { z } from 'zod';

export const miniBannerSchema = z.object({
  image: z
    .any()
    .refine(
      (val) =>
        val &&
        (typeof val === 'string' ||
          val instanceof File ||
          (typeof val === 'object' && val !== null)),
      'Image is required',
    ),
  link: z.string().optional().or(z.literal('')),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

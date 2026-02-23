import z from 'zod';

const projectValidationSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 5 characters.' }),
  slug: z.string().optional(),
  liveLink: z.string().url({ message: 'Enter a valid URL.' }),
  github: z.union([z.string().url(), z.literal('')]).optional(),
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters.' }),
  technology: z
    .array(z.string().min(1))
    .min(1, { message: 'Add at least one technology.' }),
  thumbnail: z.any().nullish(),
  photos: z.array(z.any()).nullish(),
  isFeatured: z.boolean().optional(),
});

export { projectValidationSchema };

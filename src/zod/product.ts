import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional().nullable().or(z.literal('')),
  type: z.string().optional().nullable().or(z.literal('')),
  price: z.coerce
    .number()
    .min(0, 'Price cannot be negative')
    .refine((val) => val > 0, 'Price must be greater than 0'),
  thumbnails: z
    .array(z.union([z.string(), z.any()]))
    .min(1, 'At least one product thumbnail is required')
    .max(6, 'Maximum 6 product thumbnails allowed'),
  description: z.string().optional().or(z.literal('')),
  slug: z.string().optional(),
  buyPrice: z.coerce
    .number()
    .min(0, 'Buy price cannot be negative')
    .refine((val) => val > 0, 'Buy price must be greater than 0'),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  salePrice: z.coerce
    .number()
    .min(0, 'Sale price cannot be negative')
    .default(0),
  discountPercentage: z.coerce
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%')
    .default(0),
  isOffer: z.boolean().optional().default(false),
  offerTag: z.string().optional(),
  color: z.string().min(1, 'Color is required'),
  variants: z
    .array(
      z.object({
        color: z.string().min(1, 'Variant color is required'),
        sizes: z
          .array(
            z.object({
              size: z.string().min(1, 'Size is required'),
              stock: z.coerce
                .number()
                .min(0, 'Stock cannot be negative')
                .default(0),
            }),
          )
          .default([]),
        thumbnails: z
          .array(z.union([z.string(), z.any()]))
          .max(6, 'Maximum 6 variant thumbnails allowed')
          .optional()
          .default([]),
        sku: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  sizeStock: z
    .array(
      z.object({
        size: z.string().min(1, 'Size is required'),
        stock: z.coerce.number().min(0, 'Stock cannot be negative').default(0),
      }),
    )
    .optional()
    .default([]),
  featured: z.boolean().default(false),
  sku: z.string().optional(),
  videoUrl: z.union([z.string(), z.any()]).optional(),
  youtubeVideoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  refundPolicy: z.string().optional().or(z.literal('')),
  returnPolicy: z.string().optional().or(z.literal('')),
  sizeGuide: z.string().optional().or(z.literal('')),
  seo: z.object({
    title: z.string().min(1, 'SEO title is required'),
    description: z.string().min(1, 'SEO description is required'),
    keywords: z.string().min(1, 'SEO keywords are required'),
  }),
});

export const addProductSchema = productSchema;

// On update: all fields optional, but still validated if provided.
// Arrays drop min(1) so you can update other fields without re-specifying colors/sizes.
export const updateProductSchema = productSchema.partial().extend({
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
});

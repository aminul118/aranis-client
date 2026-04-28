import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().min(1, 'Sub Category is required'),
  type: z.string().min(1, 'Type is required'),
  price: z.coerce.number().positive('Price must be positive'),
  image: z.union([z.string(), z.any()]).optional(),
  images: z
    .array(z.union([z.string(), z.any()]))
    .optional()
    .default([]),
  description: z.string().min(1, 'Description is required'),
  details: z.string().default(''),
  slug: z.string().optional(),
  buyPrice: z.coerce.number().positive('Buy price must be positive'),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  salePrice: z.coerce.number().optional().default(0),
  discountPercentage: z.coerce.number().optional().default(0),
  isOffer: z.boolean().optional().default(false),
  offerTag: z.string().optional(),
  color: z.string().min(1, 'Color is required'),
  variants: z
    .array(
      z.object({
        color: z.string().min(1, 'Variant color is required'),
        images: z
          .array(z.union([z.string(), z.any()]))
          .optional()
          .default([]),
      }),
    )
    .optional()
    .default([]),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  featured: z.boolean().default(false),
  rating: z.coerce.number().min(0).max(5).default(0),
  videoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const addProductSchema = productSchema;

// On update: all fields optional, but still validated if provided.
// Arrays drop min(1) so you can update other fields without re-specifying colors/sizes.
export const updateProductSchema = productSchema.partial().extend({
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
});

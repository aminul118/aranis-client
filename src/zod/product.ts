import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().min(1, 'Sub Category is required'),
  type: z.string().min(1, 'Type is required'),
  price: z.coerce.number().positive('Price must be positive'),
  image: z.union([z.string(), z.any()]).optional(),
  description: z.string().min(1, 'Description is required'),
  details: z.string().default(''),
  slug: z.string().optional(),
  salePrice: z.coerce.number().optional().default(0),
  colors: z.array(z.string()).min(1, 'At least one color is required'),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  featured: z.boolean().default(false),
  rating: z.coerce.number().min(0).max(5).default(0),
});

export const addProductSchema = productSchema;
export const updateProductSchema = productSchema.partial();

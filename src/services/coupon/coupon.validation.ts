import { z } from 'zod';

export const addCouponSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required').toUpperCase(),
  discount: z
    .number()
    .min(0, 'Discount must be at least 0')
    .max(100, 'Discount cannot exceed 100'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
});

export const updateCouponSchema = addCouponSchema.partial();

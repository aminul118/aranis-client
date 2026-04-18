import { z } from 'zod';

export const loginFormValidation = z.object({
  identifier: z.string().min(1, 'Email or Phone is required'),
});

export type LoginFormValues = z.infer<typeof loginFormValidation>;

export const userAddressZodSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  address: z.string().min(1, 'Address is required'),
});

export const registrationFormValidation = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().optional(),
    addresses: z.array(userAddressZodSchema).max(4).optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone is required',
    path: ['email'],
  });

export type RegistrationFormValues = z.infer<typeof registrationFormValidation>;

export const otpValidation = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const userUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  picture: z.string().optional(),
  addresses: z.array(userAddressZodSchema).max(4).optional(),
});

export type UserUpdateValues = z.infer<typeof userUpdateSchema>;

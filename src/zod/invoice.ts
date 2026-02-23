import { z } from 'zod';

const numOrZero = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? 0 : Number(v)),
  z.number().nonnegative(),
);

export const invoiceSchema = z.object({
  payableTo: z.object({
    name: z.string().min(1),
    address: z.string().optional(),
    phone: z.string().optional(),
  }),

  items: z
    .array(
      z.object({
        itemName: z.string().min(1),
        quantity: z.string().min(1),
        price: numOrZero,
        total: numOrZero,
      }),
    )
    .min(1),

  subTotal: numOrZero,
  discount: numOrZero, // ✅ now empty => 0
  tax: numOrZero,
  grandTotal: numOrZero,

  note: z.string().optional(),
  paymentInfo: z.boolean(),

  status: z.enum(['PAID', 'UNPAID', 'PENDING']).default('PENDING'),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

// Shared order types — importable by both server and client components.
// Do NOT add 'use server' or 'use client' directives here.

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export enum PaymentStatus {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
}

export interface IOrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id?: string;
  user: string;
  items: IOrderItem[];
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentStatus: PaymentStatus;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

import { IProduct, IUser } from '../../types';

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  COURIER = 'Courier',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export enum PaymentStatus {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
}

export enum PaymentMethod {
  COD = 'COD',
  CARD = 'CARD',
}

export interface IOrderItem {
  product: string | IProduct;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id?: string;
  user: IUser;
  items: IOrderItem[];
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

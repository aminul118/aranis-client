import { IProduct, IUser } from '../../types';

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  COURIER = 'Courier',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  REJECTED = 'Rejected',
  RETURNED = 'Returned',
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
  color?: string;
  size?: string;
}

export interface IOrder {
  _id?: string;
  user: IUser;
  items: IOrderItem[];
  totalPrice: number;
  subTotal?: number;
  discount?: number;
  couponCode?: string;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  isDeleted?: boolean;
  rejectionNote?: string;
  isStockDecremented?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

import type { IProduct } from '@/services/product/product.interface';
import type { IUser } from '@/services/user/user.interface';

export interface IRestockRequest {
  _id: string;
  user: IUser;
  product: IProduct;
  status: 'Pending' | 'Resolved';
  createdAt: string;
  updatedAt: string;
}

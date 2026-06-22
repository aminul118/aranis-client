import type { IProduct } from '@/services/product/product.interface';

export interface IWishlistItem {
  _id: string;
  user: string;
  product: IProduct;
  quantity: number;
  createdAt: string;
  selectedColor?: string;
  selectedSize?: string;
}

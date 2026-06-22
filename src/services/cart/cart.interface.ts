import type { IProduct } from '@/services/product/product.interface';

export interface ICartItemPayload {
  product: string;
  quantity?: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface ICartItem extends IProduct {
  cartItemId?: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  isStockOut?: boolean;
}

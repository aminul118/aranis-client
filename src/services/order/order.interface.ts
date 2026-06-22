export interface IOrderPayload {
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  subTotal: number;
  discount: number;
  couponCode?: string | null;
  shippingAddress: string;
  paymentMethod: 'COD' | 'CARD';
}

export interface ICoupon {
  _id: string;
  name: string;
  code: string;
  discount: number;
  expiryDate: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

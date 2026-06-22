export interface ICustomerInterestItem {
  _id: string;
  name: string;
  articleNo: string;
  slug: string;
  thumbnails: string[];
  price: number;
  salePrice: number;
  stock: number;
  cartCount: number;
  wishlistCount: number;
  totalInterest: number;
}

export interface IProductInterestUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  image?: string;
  role: string;
  inCart: boolean;
  inWishlist: boolean;
}

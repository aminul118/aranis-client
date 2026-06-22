export interface IReview {
  _id?: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    image?: string;
  };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

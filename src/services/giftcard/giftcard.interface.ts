export interface IGiftCard {
  _id?: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  discountPercentage: number;
  image: string;
  status: 'active' | 'inactive';
  validityDays: number;
  isDeleted?: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

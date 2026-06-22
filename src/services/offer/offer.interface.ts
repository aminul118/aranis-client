export interface IOffer {
  _id?: string;
  name: string;
  tag: string;
  discountPercentage: number;
  startDate: string | Date;
  endDate: string | Date;
  isActive: boolean;
}

export interface IHeroBanner {
  _id?: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
  isDeleted?: boolean;
}

export interface IMiniBanner {
  _id?: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
  isDeleted?: boolean;
}

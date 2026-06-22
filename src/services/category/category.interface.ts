export interface ISubCategory {
  title?: string;
  items?: string[];
}

export interface ICategory {
  _id?: string;
  name: string;
  subCategories: ISubCategory[];
  isDeleted?: boolean;
}

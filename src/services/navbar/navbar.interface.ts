export interface INavItemLink {
  label: string;
  url: string;
}

export interface INavSubItem {
  title?: string;
  href?: string;
  items: INavItemLink[];
}

export interface INavItem {
  _id?: string;
  title: string;
  href: string;
  subItems?: INavSubItem[];
  order: number;
  isDeleted?: boolean;
}

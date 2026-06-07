export interface NavSubItem {
  title: string;
  href: string;
  items: string[];
}

export interface NavMenu {
  title: string;
  href: string;
  subItems?: NavSubItem[];
}

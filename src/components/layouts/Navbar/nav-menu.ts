export interface NavSubItem {
  title: string;
  items: string[];
}

export interface NavMenu {
  title: string;
  href: string;
  subItems?: NavSubItem[];
}

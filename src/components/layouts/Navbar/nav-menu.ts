export interface NavSubItem {
  title: string;
  items: string[];
}

export interface NavMenu {
  title: string;
  href: string;
  subItems?: NavSubItem[];
}

const navItems: NavMenu[] = [
  { title: 'PHONES', href: '/shop/Phones' },
  { title: 'TABLET', href: '/shop/Tablet' },
  { title: 'LAPTOP', href: '/shop/Laptop' },
  { title: 'SMART WATCH', href: '/shop/Smart-Watch' },
  { title: 'GADGET', href: '/shop/Gadget' },
  { title: 'ACCESSORIES', href: '/shop/Accessories' },
  { title: 'SOUNDS', href: '/shop/Sounds' },
  { title: 'SMART TV', href: '/shop/Smart-TV' },
];

export { navItems };

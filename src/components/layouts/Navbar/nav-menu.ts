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
  { title: 'Home', href: '/' },
  { title: 'Shop', href: '/shop' },
  {
    title: 'Men',
    href: '/shop?category=Men',
    subItems: [
      { title: 'Shirts', items: ['Formal', 'Casual', 'Oversized'] },
      { title: 'Pants', items: ['Denim', 'Chinos', 'Cargo'] },
      { title: 'Blazers', items: ['Velvet', 'Wool', 'Linen'] },
    ],
  },
  {
    title: 'Women',
    href: '/shop?category=Women',
    subItems: [
      { title: 'Dresses', items: ['Evening', 'Summer', 'Cocktail'] },
      { title: 'Tops', items: ['Blouses', 'Knitwear', 'Tees'] },
      { title: 'Skirts', items: ['Midi', 'Mini', 'Pleated'] },
    ],
  },
  {
    title: 'Accessories',
    href: '/shop?category=Accessories',
    subItems: [
      { title: 'Watches', items: ['Classic', 'Sport', 'Luxury'] },
      { title: 'Bags', items: ['Handbags', 'Backpacks', 'Clutches'] },
      { title: 'Jewelry', items: ['Necklaces', 'Bracelets', 'Rings'] },
    ],
  },
];

export { navItems };

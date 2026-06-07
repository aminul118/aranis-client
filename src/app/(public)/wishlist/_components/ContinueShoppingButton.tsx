import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const ContinueShoppingButton = () => (
  <>
    <Link
      href="/shop"
      className="group border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-background flex items-center gap-3 rounded-full border px-8 py-3 text-sm font-black tracking-widest uppercase transition-all"
    >
      Continue Shopping{' '}
      <ShoppingBag
        size={18}
        className="transition-transform group-hover:-translate-y-0.5"
      />
    </Link>
  </>
);

export default ContinueShoppingButton;

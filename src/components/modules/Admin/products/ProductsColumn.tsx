import { Column } from '@/components/common/table/TableManageMent';
import { IProduct } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import ProductActions from './ProductActions';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const StockBadge = ({ product }: { product: IProduct }) => {
  // Always calculate total stock from components to ensure accuracy in the table
  let totalStock = 0;
  if (product.sizeStock && product.sizeStock.length > 0) {
    product.sizeStock.forEach((s) => {
      totalStock += Number(s.stock) || 0;
    });
  }
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach((v) => {
      v.sizes?.forEach((s) => {
        totalStock += Number(s.stock) || 0;
      });
    });
  }

  const stock = totalStock;

  const renderBreakdown = () => {
    const hasSizeStock = product.sizeStock && product.sizeStock.length > 0;
    const hasVariants = product.variants && product.variants.length > 0;

    if (!hasSizeStock && !hasVariants) return null;

    return (
      <div className="space-y-2 p-1">
        {hasSizeStock && (
          <div>
            <p className="border-b border-white/10 pb-1 text-[10px] font-black tracking-widest text-blue-400 uppercase">
              Main Product
            </p>
            <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1">
              {product.sizeStock?.map((s) => (
                <div
                  key={s.size}
                  className="flex justify-between gap-4 text-xs"
                >
                  <span className="font-bold text-slate-400">{s.size}:</span>
                  <span className="font-black text-white">{s.stock}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {hasVariants &&
          product.variants?.map((v, vIdx) => (
            <div key={vIdx} className="pt-1">
              <p className="border-b border-white/10 pb-1 text-[10px] font-black tracking-widest text-amber-400 uppercase">
                {v.color}
              </p>
              <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1">
                {v.sizes?.map((s) => (
                  <div
                    key={s.size}
                    className="flex justify-between gap-4 text-xs"
                  >
                    <span className="font-bold text-slate-400">{s.size}:</span>
                    <span className="font-black text-white">{s.stock}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    );
  };

  const badge = (
    <div className="cursor-help">
      {stock === 0 ? (
        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-bold text-red-500">
          Out of Stock
        </span>
      ) : stock <= 10 ? (
        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-500">
          Low ({stock})
        </span>
      ) : (
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-500">
          In Stock ({stock})
        </span>
      )}
    </div>
  );

  const breakdown = renderBreakdown();
  if (!breakdown) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="rounded-xl border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl"
        >
          {breakdown}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ProductsColumn: Column<IProduct>[] = [
  {
    header: 'Product',
    accessor: (p) => (
      <Link
        href={`/admin/products/${p._id}`}
        className="flex items-center gap-3 transition-opacity hover:opacity-80"
      >
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-white/10">
          <Image
            src={(p.thumbnails?.[0] as string) || '/placeholder.png'}
            alt={p.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="max-w-[160px] truncate font-medium">{p.name}</span>
          <span className="text-muted-foreground text-xs">
            {p.category} · {p.subCategory}
          </span>
        </div>
      </Link>
    ),
  },
  {
    header: 'Price',
    accessor: (p) => (
      <div className="flex flex-col">
        <span className="font-bold">৳{p.price.toFixed(2)}</span>
        {p.salePrice && (
          <span className="text-xs font-bold text-emerald-500">
            Sale: ৳{p.salePrice.toFixed(2)}
          </span>
        )}
      </div>
    ),
  },
  {
    header: 'Stock',
    accessor: (p) => <StockBadge product={p} />,
  },
  {
    header: 'Sold',
    accessor: (p) => (
      <span className="text-muted-foreground text-sm font-bold">
        {p.soldCount ?? 0}
      </span>
    ),
  },
  {
    header: 'Featured',
    accessor: (p) =>
      p.featured ? (
        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-500">
          Yes
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">No</span>
      ),
  },
  {
    header: 'Actions',
    accessor: (p) => <ProductActions product={p} />,
  },
];

export default ProductsColumn;

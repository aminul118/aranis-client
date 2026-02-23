import { Column } from '@/components/common/table/TableManageMent';
import { IProduct } from '@/services/product/product';
import ProductActions from './ProductActions';
import Image from 'next/image';
import PlaceHolderImage from '@/components/common/PlaceHolderImage';

const ProductsColumn: Column<IProduct>[] = [
    {
        header: 'Product',
        accessor: (p) => (
            <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-md border border-white/10">
                    <Image
                        src={p.image as string || '/placeholder.png'}
                        alt={p.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.category}</span>
                </div>
            </div>
        ),
    },
    {
        header: 'Price',
        accessor: (p) => `$${p.price.toFixed(2)}`,
    },
    {
        header: 'Stock Status',
        accessor: (p) => (
            <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full font-medium">
                In Stock
            </span>
        ),
    },
    {
        header: 'Featured',
        accessor: (p) => p.featured ? 'Yes' : 'No',
    },
    {
        header: 'Actions',
        accessor: (p) => <ProductActions product={p} />,
    },
];

export default ProductsColumn;

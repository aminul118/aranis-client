'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import { IProduct } from '@/services/product/product';
import ProductsColumn from './ProductsColumn';

const ProductsTable = ({ products }: { products: IProduct[] }) => {
    return (
        <TableManageMent
            columns={ProductsColumn}
            data={products || []}
            getRowKey={(p) => p._id as string}
            emptyMessage="No product found"
        />
    );
};

export default ProductsTable;

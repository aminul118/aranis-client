import ProductCard from '@/components/common/ProductCard';
import ProductDetailContent from '@/components/modules/Public/Products/ProductDetailContent';
import { getProducts, getSingleProduct } from '@/services/product/product';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: product } = await getSingleProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Aranis',
    };
  }

  return {
    title: `${product.name} | Aranis`,
    description: product.description.replace(/<[^>]*>/g, '').slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.replace(/<[^>]*>/g, '').slice(0, 160),
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  };
}

const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;
  const { data: product } = await getSingleProduct(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products (same category)
  const { data: relatedProductsResponse } = await getProducts({
    category: product.category,
    limit: '12',
  });
  const relatedProducts =
    relatedProductsResponse
      ?.filter((p) => p._id !== product._id)
      .slice(0, 10) || [];

  return (
    <div className="bg-background min-h-screen pt-28 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <Link
          href="/shop"
          className="text-muted-foreground hover:text-foreground group mb-12 inline-flex items-center text-xs font-bold tracking-widest uppercase transition-all"
        >
          <ArrowLeft className="mr-3 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Explore More Collections
        </Link>

        <ProductDetailContent product={product} />

        {relatedProducts.length > 0 && (
          <div className="border-border/50 mt-24 border-t pt-16">
            <div className="mb-10 text-center">
              <h2 className="text-foreground mb-4 text-3xl font-black tracking-tight capitalize md:text-4xl">
                You May Also Like
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Discover more premium pieces from our {product.category}{' '}
                collection.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;

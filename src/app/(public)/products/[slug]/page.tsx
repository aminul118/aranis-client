import ProductDetailContent from '@/app/(public)/products/[slug]/_components/ProductDetailContent';
import AnimatedSection from '@/components/common/AnimatedSection';
import ProductCard from '@/components/common/ProductCard';
import { getProducts, getSingleProduct } from '@/services/product/product';
import { getSiteSettings } from '@/services/settings/settings';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await getProducts({ limit: '28', page: page.toString() });
    if (res?.data && res.data.length > 0) {
      products.push(...res.data);
      if (page >= (res.meta?.totalPage || 1)) {
        hasMore = false;
      } else {
        page++;
      }
    } else {
      hasMore = false;
    }
  }

  return (
    products?.map((product) => ({
      slug: product.slug,
    })) || []
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: product } = await getSingleProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Aranis',
    };
  }

  const title = product.seo?.title || `${product.name} | Aranis`;
  const description = product.seo?.description || '';
  const keywords = product.seo?.keywords || '';

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: product.seo?.title || title,
      description,
      images: [
        {
          url: product.thumbnails[0],
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'https://thearanis.com'}/products/${slug}`,
    },
  };
}

const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;
  const [{ data: product }, { data: settings }] = await Promise.all([
    getSingleProduct(slug),
    getSiteSettings(),
  ]);

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
    <div className="bg-background pt-8 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <Link
          href="/shop"
          className="hover:text-foreground group mb-12 inline-flex items-center text-xs font-bold tracking-widest text-zinc-700 uppercase transition-all dark:text-zinc-300"
        >
          <ArrowLeft className="mr-3 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Explore More Collections
        </Link>

        <ProductDetailContent product={product} settings={settings} />

        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-16">
            <div className="mb-10 text-center">
              <h2 className="text-foreground mb-4 text-3xl font-black tracking-tight capitalize md:text-4xl">
                You May Also Like
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Discover more premium pieces from our {product.category}{' '}
                collection.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {relatedProducts.map((relatedProduct, index) => (
                <AnimatedSection key={relatedProduct._id} variant="fadeUp">
                  <ProductCard product={relatedProduct} index={index} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;

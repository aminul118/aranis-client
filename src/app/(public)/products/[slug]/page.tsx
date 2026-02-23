import { getSingleProduct } from '@/services/product/product';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailContent from '@/components/modules/Public/Products/ProductDetailContent';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const { data: product } = await getSingleProduct(slug);

    if (!product) {
        return {
            title: 'Product Not Found | Lumiere',
        };
    }

    return {
        title: `${product.name} | Lumiere`,
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

    return (
        <div className="min-h-screen bg-background pt-28 pb-16">
            <div className="container mx-auto px-4 md:px-6">
                <Link
                    href="/shop"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground mb-12 transition-all group font-bold text-xs uppercase tracking-widest"
                >
                    <ArrowLeft className="mr-3 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Explore More Collections
                </Link>

                <ProductDetailContent product={product} />
            </div>
        </div>
    );
};

export default ProductPage;

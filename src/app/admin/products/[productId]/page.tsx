import HtmlContent from '@/components/rich-text/core/html-content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSingleProduct } from '@/services/product/product';
import {
  AlignLeft,
  ArrowLeft,
  BarChart3,
  ImageIcon,
  Layers,
  Package,
  Palette,
  Pencil,
  Ruler,
  ShoppingCart,
  Tag,
  TrendingUp,
} from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const res = await getSingleProduct(productId);
  return { title: `${res.data?.name || 'Product'} | Admin` };
}

export default async function ProductDetailPage({ params }: Props) {
  const { productId } = await params;
  const res = await getSingleProduct(productId);
  const product = res.data;
  if (!product) notFound();

  const stockStatus =
    product.stock > 10
      ? {
          label: 'In Stock',
          cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        }
      : product.stock > 0
        ? {
            label: 'Low Stock',
            cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          }
        : {
            label: 'Out of Stock',
            cls: 'bg-red-500/10 text-red-500 border-red-500/20',
          };

  const profit = product.salePrice
    ? product.salePrice - product.buyPrice
    : product.price - product.buyPrice;
  const margin =
    product.buyPrice > 0
      ? ((profit / (product.salePrice || product.price)) * 100).toFixed(1)
      : '—';

  return (
    <div className="animate-in fade-in container mx-auto max-w-6xl space-y-8 p-6 duration-500">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground group mb-2 -ml-2"
          >
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Products
            </Link>
          </Button>
          <h1 className="text-3xl font-black tracking-tight">{product.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {product.subCategory}
            </Badge>
            {product.type && (
              <Badge variant="outline" className="text-xs">
                {product.type}
              </Badge>
            )}
            {product.featured && (
              <Badge className="border border-blue-500/20 bg-blue-500/10 text-xs text-blue-500">
                Featured
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`border text-xs ${stockStatus.cls}`}
            >
              {stockStatus.label}
            </Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="rounded-full font-bold">
            <Link href={`/products/${product.slug}`} target="_blank">
              View Public Page
            </Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-blue-600 font-bold hover:bg-blue-700"
          >
            <Link href={`/admin/products/${product._id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Image + Pricing */}
        <div className="space-y-6 lg:col-span-1">
          {/* Image */}
          <Card className="border-border/40 overflow-hidden">
            <div className="bg-muted relative aspect-square w-full">
              {product.thumbnails?.[0] ? (
                <Image
                  src={product.thumbnails?.[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                  <ImageIcon size={48} />
                </div>
              )}
            </div>
          </Card>

          {/* Pricing Card */}
          <Card className="border-border/40 border-t-4 border-t-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="text-blue-500" size={16} />
                Pricing & Margins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Row
                label="Buy Price"
                value={`$${product.buyPrice?.toFixed(2) ?? '—'}`}
              />
              <Row
                label="Sell Price"
                value={
                  <span className="font-black text-blue-500">
                    ${product.price.toFixed(2)}
                  </span>
                }
              />
              {product.salePrice && (
                <Row
                  label="Sale Price"
                  value={
                    <span className="font-black text-emerald-500">
                      ${product.salePrice.toFixed(2)}
                    </span>
                  }
                />
              )}
              <div className="border-border/40 border-t pt-2">
                <Row
                  label="Margin"
                  value={
                    <span className="font-black text-amber-500">{margin}%</span>
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard
              icon={<Package />}
              label="Stock"
              value={product.stock}
              color="blue"
            />
            <StatCard
              icon={<ShoppingCart />}
              label="Sold"
              value={product.soldCount ?? 0}
              color="emerald"
            />
            <StatCard
              icon={<TrendingUp />}
              label="Sales"
              value={`$${((product.soldCount ?? 0) * product.price).toFixed(0)}`}
              color="purple"
            />
          </div>

          {/* Description */}
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlignLeft className="text-blue-500" size={16} />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.description ? (
                <HtmlContent
                  content={product.description}
                  className="prose prose-sm dark:prose-invert text-muted-foreground max-w-none leading-relaxed"
                />
              ) : (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  No description provided.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Attributes */}
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="text-blue-500" size={16} />
                Attributes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Colors */}
              {product.color && (
                <div>
                  <p className="text-muted-foreground mb-2 flex items-center gap-1 text-[10px] font-black tracking-widest uppercase">
                    <Palette size={12} /> Color
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="border-border bg-muted rounded-full border px-3 py-1 text-xs font-medium">
                      {product.color}
                    </span>
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2 flex items-center gap-1 text-[10px] font-black tracking-widest uppercase">
                    <Ruler size={12} /> Sizes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <span
                        key={s}
                        className="border-border bg-muted rounded-full border px-3 py-1 text-xs font-bold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Slug */}
              <div>
                <p className="text-muted-foreground mb-1 flex items-center gap-1 text-[10px] font-black tracking-widest uppercase">
                  <BarChart3 size={12} /> Slug
                </p>
                <code className="bg-muted border-border rounded-lg border px-3 py-1.5 font-mono text-xs">
                  {product.slug}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helpers
const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

const colorMap: Record<string, string> = {
  blue: 'text-blue-500 bg-blue-500/10',
  amber: 'text-amber-500 bg-amber-500/10',
  emerald: 'text-emerald-500 bg-emerald-500/10',
  purple: 'text-purple-500 bg-purple-500/10',
};

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  color: string;
}) => (
  <div className="border-border/40 bg-card flex flex-col gap-2 rounded-2xl border p-4">
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorMap[color]}`}
    >
      {icon}
    </div>
    <p className="text-xl font-black">{value}</p>
    <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
      {label}
    </p>
  </div>
);

import { getSingleProduct } from '@/services/product/product';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    Pencil,
    Package,
    Tag,
    Star,
    Layers,
    Palette,
    Ruler,
    TrendingUp,
    ShoppingCart,
    BarChart3,
    ImageIcon,
    AlignLeft,
} from 'lucide-react';

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

    const stockStatus = product.stock > 10
        ? { label: 'In Stock', cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' }
        : product.stock > 0
            ? { label: 'Low Stock', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' }
            : { label: 'Out of Stock', cls: 'bg-red-500/10 text-red-500 border-red-500/20' };

    const profit = product.salePrice
        ? product.salePrice - product.buyPrice
        : product.price - product.buyPrice;
    const margin = product.buyPrice > 0
        ? ((profit / (product.salePrice || product.price)) * 100).toFixed(1)
        : '—';

    return (
        <div className="container mx-auto p-6 max-w-6xl space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 text-muted-foreground hover:text-foreground group">
                        <Link href="/admin/products">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Products
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-black tracking-tight">{product.name}</h1>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{product.category}</Badge>
                        <Badge variant="outline" className="text-xs">{product.subCategory}</Badge>
                        {product.type && <Badge variant="outline" className="text-xs">{product.type}</Badge>}
                        {product.featured && (
                            <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs">Featured</Badge>
                        )}
                        <Badge variant="outline" className={`text-xs border ${stockStatus.cls}`}>{stockStatus.label}</Badge>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button asChild variant="outline" className="rounded-full font-bold">
                        <Link href={`/products/${product.slug}`} target="_blank">View Public Page</Link>
                    </Button>
                    <Button asChild className="rounded-full bg-blue-600 hover:bg-blue-700 font-bold">
                        <Link href={`/admin/products/${product._id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Product
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Image + Pricing */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Image */}
                    <Card className="border-border/40 overflow-hidden">
                        <div className="relative aspect-square w-full bg-muted">
                            {product.image ? (
                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
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
                            <Row label="Buy Price" value={`$${product.buyPrice?.toFixed(2) ?? '—'}`} />
                            <Row label="Sell Price" value={<span className="font-black text-blue-500">${product.price.toFixed(2)}</span>} />
                            {product.salePrice && (
                                <Row label="Sale Price" value={<span className="font-black text-emerald-500">${product.salePrice.toFixed(2)}</span>} />
                            )}
                            <div className="pt-2 border-t border-border/40">
                                <Row label="Margin" value={<span className="font-black text-amber-500">{margin}%</span>} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard icon={<Package />} label="Stock" value={product.stock} color="blue" />
                        <StatCard icon={<Star />} label="Rating" value={product.rating?.toFixed(1) ?? '—'} color="amber" />
                        <StatCard icon={<ShoppingCart />} label="Sold" value={product.soldCount ?? 0} color="emerald" />
                        <StatCard icon={<TrendingUp />} label="Sales" value={`$${((product.soldCount ?? 0) * product.price).toFixed(0)}`} color="purple" />
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
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {product.description || 'No description provided.'}
                            </p>
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
                            {product.colors?.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
                                        <Palette size={12} /> Colors
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map((c) => (
                                            <span key={c} className="px-3 py-1 rounded-full border border-border bg-muted text-xs font-medium">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sizes */}
                            {product.sizes?.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
                                        <Ruler size={12} /> Sizes
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((s) => (
                                            <span key={s} className="px-3 py-1 rounded-full border border-border bg-muted text-xs font-bold">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Slug */}
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1">
                                    <BarChart3 size={12} /> Slug
                                </p>
                                <code className="text-xs bg-muted px-3 py-1.5 rounded-lg border border-border font-mono">{product.slug}</code>
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
    <div className="flex justify-between items-center text-sm">
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

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: React.ReactNode; color: string }) => (
    <div className="rounded-2xl border border-border/40 bg-card p-4 flex flex-col gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
            {icon}
        </div>
        <p className="text-xl font-black">{value}</p>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{label}</p>
    </div>
);

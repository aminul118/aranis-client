'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search,
    SlidersHorizontal,
    X,
    ChevronDown,
    LayoutGrid,
    List,
    Star
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { getProducts, IProduct } from '@/services/product/product';

const ShopPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { addToCart } = useCart();

    const [allProducts, setAllProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [selectedSub, setSelectedSub] = useState(searchParams.get('subCategory') || 'All');
    const [selectedPrice, setSelectedPrice] = useState<[number, number]>([0, 1000]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('Newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Constants
    const categories = ['All', 'Men', 'Women', 'Accessories'];
    const colors = ['Black', 'Blue', 'White', 'Beige', 'Red', 'Emerald', 'Gold', 'Silver'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    // Sync with URL params
    useEffect(() => {
        setSelectedCategory(searchParams.get('category') || 'All');
        setSelectedSub(searchParams.get('subCategory') || 'All');
        setSearchQuery(searchParams.get('q') || '');
    }, [searchParams]);

    // Fetch products
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const { data } = await getProducts({});
                setAllProducts(data || []);
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        return allProducts.filter((product) => {
            const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchSub = selectedSub === 'All' || product.subCategory === selectedSub;
            const matchPrice = product.price >= selectedPrice[0] && product.price <= selectedPrice[1];
            const matchColor = selectedColors.length === 0 || selectedColors.some(c => product.colors.includes(c));
            const matchSize = selectedSizes.length === 0 || selectedSizes.some(s => product.sizes.includes(s));

            return matchSearch && matchCategory && matchSub && matchPrice && matchColor && matchSize;
        }).sort((a, b) => {
            if (sortBy === 'Price: Low-High') return a.price - b.price;
            if (sortBy === 'Price: High-Low') return b.price - a.price;
            if (sortBy === 'Top Rated') return b.rating - a.rating;
            return 1; // Simplified sort for now
        });
    }, [allProducts, searchQuery, selectedCategory, selectedSub, selectedPrice, selectedColors, selectedSizes, sortBy]);

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === 'All') params.delete(key);
        else params.set(key, value);
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-slate-950 pt-28 pb-20">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Lumiere Shop</h1>
                        <p className="text-slate-500">Discover excellence in every thread ({filteredProducts.length} items)</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <Input
                                placeholder="Search products..."
                                className="pl-12 bg-slate-900 border-white/5 text-white rounded-full py-6 focus:border-blue-500/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="lg:hidden rounded-full border-white/5 py-6 px-6"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <SlidersHorizontal size={20} />
                        </Button>
                    </div>
                </div>

                <div className="flex gap-12 items-start">
                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden lg:flex w-64 flex-col gap-10 sticky top-32">
                        <div>
                            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Category</h3>
                            <div className="flex flex-col gap-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => updateFilters('category', cat)}
                                        className={cn(
                                            "text-left transition-colors text-base",
                                            selectedCategory === cat ? "text-blue-400 font-bold" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Colors</h3>
                            <div className="flex flex-wrap gap-3">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => {
                                            setSelectedColors(prev =>
                                                prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
                                            );
                                        }}
                                        className={cn(
                                            "w-8 h-8 rounded-full border border-white/10 transition-transform hover:scale-110",
                                            selectedColors.includes(color) && "ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-950"
                                        )}
                                        style={{ backgroundColor: color.toLowerCase().replace('silk ', '') }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Sizes</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => {
                                            setSelectedSizes(prev =>
                                                prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                                            );
                                        }}
                                        className={cn(
                                            "py-2 rounded-lg border text-sm font-bold transition-all",
                                            selectedSizes.includes(size)
                                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                : "bg-slate-900 border-white/5 text-slate-400 hover:border-white/20"
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Price Range</h3>
                            <input
                                type="range"
                                min="50"
                                max="1000"
                                value={selectedPrice[1]}
                                onChange={(e) => setSelectedPrice([selectedPrice[0], parseInt(e.target.value)])}
                                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between mt-3 text-xs font-mono text-slate-500">
                                <span>$50</span>
                                <span className="text-blue-400 font-bold">${selectedPrice[1]}</span>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            className="justify-start p-0 text-slate-500 hover:text-white"
                            onClick={() => {
                                setSelectedCategory('All');
                                setSelectedSub('All');
                                setSelectedColors([]);
                                setSelectedSizes([]);
                                setSelectedPrice([0, 1000]);
                                router.push('/shop');
                            }}
                        >
                            Clear all filters
                        </Button>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="flex h-64 items-center justify-center">
                                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <>
                                {/* Toolbar */}
                                <div className="flex justify-between items-center mb-8 pb-8 border-b border-white/5">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={cn("rounded-md", viewMode === 'grid' ? "bg-white/10 text-white" : "text-slate-500")}
                                            onClick={() => setViewMode('grid')}
                                        >
                                            <LayoutGrid size={18} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={cn("rounded-md", viewMode === 'list' ? "bg-white/10 text-white" : "text-slate-500")}
                                            onClick={() => setViewMode('list')}
                                        >
                                            <List size={18} />
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500 text-sm hidden sm:block">Sort by:</span>
                                        <select
                                            className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option value="Newest">Newest</option>
                                            <option value="Price: Low-High">Price: Low-High</option>
                                            <option value="Price: High-Low">Price: High-Low</option>
                                            <option value="Top Rated">Top Rated</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Product Grid */}
                                {filteredProducts.length > 0 ? (
                                    <div className={cn(
                                        "grid gap-8",
                                        viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                                    )}>
                                        {filteredProducts.map((product) => (
                                            <motion.div
                                                key={product._id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className={cn(
                                                    "group bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden transition-all hover:border-blue-500/20",
                                                    viewMode === 'list' && "flex flex-col sm:flex-row gap-6 p-4"
                                                )}
                                            >
                                                <Link
                                                    href={`/products/${product._id}`}
                                                    className={cn(
                                                        "relative block overflow-hidden",
                                                        viewMode === 'grid' ? "aspect-4/5" : "w-full sm:w-48 aspect-square rounded-2xl"
                                                    )}
                                                >
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </Link>

                                                <div className="p-6 flex-1 flex flex-col">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{product.subCategory}</span>
                                                        <div className="flex items-center gap-1 text-xs text-amber-400">
                                                            <Star size={12} fill="currentColor" />
                                                            <span>{product.rating}</span>
                                                        </div>
                                                    </div>
                                                    <Link href={`/products/${product._id}`}>
                                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors truncate capitalize">
                                                            {product.name}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-1">
                                                        {product.description}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-auto">
                                                        <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                addToCart(product as any);
                                                                toast.success(`${product.name} added to cart!`);
                                                            }}
                                                            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-lg shadow-blue-500/20"
                                                        >
                                                            Add
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center">
                                        <p className="text-slate-500 text-xl font-medium">No products match your filters.</p>
                                        <Button
                                            variant="link"
                                            onClick={() => router.push('/shop')}
                                            className="text-blue-400 mt-2"
                                        >
                                            Reset all filters
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-4/5 max-w-sm bg-slate-900 z-50 p-8 flex flex-col gap-10 overflow-y-auto lg:hidden"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">Filters</h2>
                                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500">
                                    <X size={24} />
                                </button>
                            </div>
                            {/* ... (repeat filters here for mobile) */}
                            <div>
                                <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Category</h3>
                                <div className="flex flex-col gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                updateFilters('category', cat);
                                                setIsSidebarOpen(false);
                                            }}
                                            className={cn(
                                                "text-left transition-colors text-base",
                                                selectedCategory === cat ? "text-blue-400 font-bold" : "text-slate-400 hover:text-white"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShopPage;

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ArrowRight, Package, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import envVars from '@/config/env.config';

interface SearchProduct {
    _id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    category: string;
}

const NavSearch = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Keyboard shortcut: Ctrl+K / Cmd+K
    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(prev => !prev);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, []);

    // Focus input on open
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery('');
            setResults([]);
        }
    }, [open]);

    // Debounced search
    const searchProducts = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(
                `${envVars.baseUrl}/products?search=${encodeURIComponent(searchQuery)}&limit=5`
            );
            const data = await res.json();
            setResults(data?.data || []);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            searchProducts(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query, searchProducts]);

    const handleClose = () => setOpen(false);

    const handleSeeMore = () => {
        router.push(`/shop?search=${encodeURIComponent(query)}`);
        handleClose();
    };

    return (
        <>
            {/* Search trigger button */}
            <button
                onClick={() => setOpen(true)}
                aria-label="Open search"
                className="relative flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground transition-all hover:border-blue-500/50 hover:text-foreground hover:bg-muted"
            >
                <Search size={16} />
                <span className="hidden md:inline text-xs">Search...</span>
                <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                    ⌘K
                </kbd>
            </button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                            onClick={handleClose}
                        />

                        {/* Search panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -20 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="fixed left-1/2 top-[10%] z-[101] w-full max-w-xl -translate-x-1/2 px-4"
                        >
                            <div className="rounded-2xl border border-border bg-background/95 shadow-2xl shadow-black/30 backdrop-blur-xl overflow-hidden">
                                {/* Input row */}
                                <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                                    <Search size={18} className="text-muted-foreground shrink-0" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                                    />
                                    {loading && <Loader2 size={16} className="text-blue-500 animate-spin shrink-0" />}
                                    {query && !loading && (
                                        <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground transition-colors">
                                            <X size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={handleClose}
                                        className="rounded-lg border border-border bg-muted px-2 py-1 text-xs text-muted-foreground hover:bg-muted/80 transition-colors"
                                    >
                                        Esc
                                    </button>
                                </div>

                                {/* Results */}
                                <div className="max-h-[60vh] overflow-y-auto">
                                    {!query && (
                                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                                            <Package className="h-10 w-10 text-muted-foreground/30" />
                                            <p className="text-sm text-muted-foreground">Start typing to search products</p>
                                        </div>
                                    )}

                                    {query && results.length === 0 && !loading && (
                                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                                            <Package className="h-10 w-10 text-muted-foreground/30" />
                                            <p className="text-sm font-medium">No results for &ldquo;{query}&rdquo;</p>
                                            <p className="text-xs text-muted-foreground">Try a different search term</p>
                                        </div>
                                    )}

                                    {results.length > 0 && (
                                        <div className="p-2">
                                            <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                                Products
                                            </p>
                                            {results.map((product, idx) => (
                                                <Link
                                                    key={product._id}
                                                    href={`/products/${product.slug}`}
                                                    onClick={handleClose}
                                                    className={cn(
                                                        'group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-muted/70',
                                                    )}
                                                >
                                                    {/* Product Image */}
                                                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="56px"
                                                        />
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-sm leading-tight truncate group-hover:text-blue-500 transition-colors">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right shrink-0">
                                                        <p className="font-bold text-sm">${product.price?.toFixed(2)}</p>
                                                    </div>

                                                    <ArrowRight size={14} className="text-muted-foreground shrink-0 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer: See More button */}
                                {results.length > 0 && query && (
                                    <div className="border-t border-border p-3">
                                        <button
                                            onClick={handleSeeMore}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 active:scale-[0.98]"
                                        >
                                            See all results for &ldquo;{query}&rdquo;
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default NavSearch;

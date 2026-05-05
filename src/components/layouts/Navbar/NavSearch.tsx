'use client';

import envVars from '@/config/env.config';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Loader2, Package, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

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
        setOpen((prev) => !prev);
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
        `${envVars.baseUrl}/products?search=${encodeURIComponent(searchQuery)}&limit=5`,
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
    router.push(`/shop?q=${encodeURIComponent(query)}`);
    handleClose();
  };

  return (
    <>
      {/* Mobile Search Trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className="flex items-center justify-center rounded-full p-2 text-white hover:bg-white/10 sm:hidden"
      >
        <Search size={20} />
      </button>

      {/* Desktop Search trigger: Wide Professional Bar */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className="group relative hidden max-w-2xl flex-1 sm:flex"
      >
        <div className="flex w-full items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-4 py-2.5 pr-12 text-left text-sm text-gray-400 transition-all outline-none group-hover:border-blue-500/30 dark:border-white/5">
          <span>Search products...</span>
        </div>
        <div className="absolute top-1 right-1 bottom-1 flex items-center justify-center rounded bg-black p-4 text-white transition-colors">
          <Search size={18} />
        </div>
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
              className="fixed top-[10%] left-1/2 z-[101] w-full max-w-xl -translate-x-1/2 px-4"
            >
              <div className="border-border bg-background/95 overflow-hidden rounded-2xl border shadow-2xl shadow-black/30 backdrop-blur-xl dark:border-white/5 dark:bg-[#111111]/95">
                {/* Input row */}
                <div className="border-border flex items-center gap-3 border-b px-4 py-3.5 dark:border-white/5">
                  <Search
                    size={18}
                    className="text-muted-foreground shrink-0"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="placeholder:text-muted-foreground text-foreground flex-1 bg-transparent text-base outline-none"
                  />
                  {loading && (
                    <Loader2
                      size={16}
                      className="shrink-0 animate-spin text-blue-500"
                    />
                  )}
                  {query && !loading && (
                    <button
                      onClick={() => setQuery('')}
                      className="text-muted-foreground hover:text-foreground transition-colors dark:hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="border-border bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg border px-2 py-1 text-xs transition-colors dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10"
                  >
                    Esc
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {!query && (
                    <div className="flex flex-col items-center justify-center gap-2 py-12">
                      <Package className="text-muted-foreground/30 h-10 w-10" />
                      <p className="text-muted-foreground text-sm">
                        Start typing to search products
                      </p>
                    </div>
                  )}

                  {query && results.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center gap-2 py-12">
                      <Package className="text-muted-foreground/30 h-10 w-10" />
                      <p className="text-sm font-medium">
                        No results for &ldquo;{query}&rdquo;
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Try a different search term
                      </p>
                    </div>
                  )}

                  {results.length > 0 && (
                    <div className="p-2">
                      <p className="text-muted-foreground/60 px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase">
                        Products
                      </p>
                      {results.map((product, idx) => (
                        <Link
                          key={product._id}
                          href={`/products/${product.slug}`}
                          onClick={handleClose}
                          className={cn(
                            'group hover:bg-muted/70 flex items-center gap-4 rounded-xl p-3 transition-colors dark:hover:bg-white/5',
                          )}
                        >
                          {/* Product Image */}
                          <div className="bg-muted border-border relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border dark:border-white/5 dark:bg-white/5">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm leading-tight font-semibold transition-colors group-hover:text-blue-500">
                              {product.name}
                            </p>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                              {product.category}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-bold">
                              ৳{product.price?.toFixed(2)}
                            </p>
                          </div>

                          <ArrowRight
                            size={14}
                            className="text-muted-foreground shrink-0 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                          />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: See More button */}
                {results.length > 0 && query && (
                  <div className="border-border border-t p-3 dark:border-white/5">
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

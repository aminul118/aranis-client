'use client';

import ProductCard from '@/components/common/ProductCard';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

interface OfferListProps {
  products: any[];
  tag?: string;
}

const OfferList = ({ products, tag }: OfferListProps) => {
  const hasProducts = products && products.length > 0;

  return (
    <div className="container mx-auto px-4">
      {/* Header Section - Only show if offers exist */}
      {hasProducts && (
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="mx-auto mb-10 flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-red-500/10 to-pink-500/10 text-red-500 backdrop-blur-3xl"
          >
            <Gift size={56} strokeWidth={1} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-foreground mb-6 text-6xl font-black tracking-tighter uppercase italic md:text-9xl">
              {tag || 'Special'} <span className="text-red-500">Offers</span>
            </h1>
            <p className="text-muted-foreground/60 mx-auto max-w-2xl text-lg leading-relaxed font-medium">
              Discover our most coveted pieces at temporary, privileged pricing.
            </p>
          </motion.div>
        </div>
      )}

      {/* Grid Section */}
      {hasProducts ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </motion.div>
      ) : (
        /* Cute & Simple Empty State (Matching Cart/Wishlist) */
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-50/80 text-red-400 dark:bg-red-900/20"
            >
              <Gift size={48} strokeWidth={1.5} />
            </motion.div>

            <h1 className="text-foreground mb-3 text-3xl font-bold tracking-tight">
              No active offers
            </h1>

            <p className="text-muted-foreground mb-10 max-w-[280px] text-base leading-relaxed">
              We're currently preparing our next seasonal curation. Stay tuned!
            </p>

            <div className="h-1.5 w-16 rounded-full bg-red-500/10" />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OfferList;

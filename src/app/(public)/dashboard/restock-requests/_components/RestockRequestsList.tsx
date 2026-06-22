'use client';

import DeleteConfirmation from '@/components/common/actions/DeleteConfirmation';
import AppSearching from '@/components/common/searching/AppSearching';
import { Button } from '@/components/ui/button';
import { deleteRestockRequest } from '@/services/restock/restock';
import type { IRestockRequest } from '@/services/restock/restock.interface';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, RefreshCcw, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const RestockRequestsList = ({ requests }: { requests: IRestockRequest[] }) => {
  return (
    <div className="flex h-full flex-col gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-[#0a0a0a]">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center dark:border-white/10">
        <div className="flex items-center gap-3">
          <RefreshCcw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Restock Requests
          </h2>
        </div>
        <div className="relative w-full md:w-80">
          <AppSearching placeholder="Search products..." className="w-full" />
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-card/30 border-border rounded-3xl border border-dashed py-24 text-center">
          <div className="bg-muted text-muted-foreground mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
            <RefreshCcw size={32} />
          </div>
          <h3 className="mb-2 text-xl font-bold">No requests found</h3>
          <p className="text-muted-foreground mb-8">
            You haven&apos;t made any restock requests that match your search.
          </p>
          <Button
            asChild
            className="rounded-full bg-blue-600 px-8 hover:bg-blue-700"
          >
            <Link href="/shop">
              Browse Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {requests.map((req) => {
              // Determine if the product is actually available
              const isAvailable =
                (req.product?.stock && req.product.stock > 0) ||
                req.status === 'Resolved';
              const displayStatus = isAvailable ? 'Available' : req.status;

              return (
                <motion.div
                  key={req._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group border-border flex flex-col gap-4 rounded-xl border p-4 transition-all hover:border-blue-500/30 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800">
                      <Image
                        src={req.product?.thumbnails?.[0] || '/placeholder.png'}
                        alt={req.product?.name || 'Product Image'}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="relative flex flex-1 flex-col pr-6">
                      <div className="absolute -top-2 -right-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <DeleteConfirmation
                          onConfirm={() => deleteRestockRequest(req._id)}
                          title="Delete Request?"
                          description="Are you sure you want to remove this restock request? You will no longer receive notifications for this product."
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DeleteConfirmation>
                      </div>
                      <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                        {req.product?.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            isAvailable
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
                          {displayStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-border mt-auto border-t pt-2">
                    <Button
                      asChild
                      variant={isAvailable ? 'default' : 'outline'}
                      className="w-full"
                    >
                      <Link href={`/products/${req.product?.slug}`}>
                        {isAvailable ? 'Order Now' : 'View Product'}
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default RestockRequestsList;

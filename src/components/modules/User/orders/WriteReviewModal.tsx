'use client';

import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Send, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ReviewItem {
  productId: string;
  productName: string;
  productImage: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  items: ReviewItem[];
}

const WriteReviewModal = ({ open, onClose, items }: Props) => {
  const [comments, setComments] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulate API call (review API to be integrated when endpoint is ready)
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setComments({});
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-background border-border relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border shadow-2xl"
        >
          {/* Header */}
          <div className="border-border bg-muted/20 flex items-center justify-between border-b px-6 py-5">
            <div>
              <h2 className="text-xl font-black tracking-tight">
                Write a Review
              </h2>
              <p className="text-muted-foreground text-sm">
                Share your experience
              </p>
            </div>
            <button
              onClick={handleClose}
              className="hover:bg-muted rounded-full p-2 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black">Thank You!</h3>
                <p className="text-muted-foreground">
                  Your review has been submitted. It helps other shoppers
                  discover great products.
                </p>
                <Button
                  onClick={handleClose}
                  className="mt-2 rounded-full bg-emerald-600 px-8 hover:bg-emerald-700"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.productId} className="space-y-4">
                    {/* Product */}
                    <div className="flex items-center gap-4">
                      <div className="bg-muted border-border relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm leading-tight font-bold">
                          {item.productName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Rate your purchase
                        </p>
                      </div>
                    </div>

                    {/* Comment */}
                    <textarea
                      value={comments[item.productId] ?? ''}
                      onChange={(e) =>
                        setComments((prev) => ({
                          ...prev,
                          [item.productId]: e.target.value,
                        }))
                      }
                      placeholder="Share what you loved (or didn't)..."
                      rows={3}
                      className="bg-muted/50 border-border w-full resize-none rounded-xl border p-4 text-sm transition-all focus:border-blue-500/50 focus:outline-none"
                    />

                    {items.length > 1 && <hr className="border-border/50" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {!submitted && (
            <div className="border-border bg-muted/10 border-t px-6 py-4">
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full gap-2 rounded-full bg-blue-600 py-6 text-base font-bold hover:bg-blue-700"
              >
                {submitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send size={16} />
                    Submit Review
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WriteReviewModal;

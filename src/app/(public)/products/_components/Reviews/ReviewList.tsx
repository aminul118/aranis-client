'use client';

import { IReview } from '@/services/review/review';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';
import Image from 'next/image';

interface ReviewListProps {
  reviews: IReview[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <div className="bg-muted/20 border-border rounded-3xl border border-dashed py-20 text-center">
        <p className="text-muted-foreground font-medium">
          Be the first to share your thoughts on this masterpiece.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reviews.map((review, index) => (
        <motion.div
          key={review._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card border-border/50 rounded-3xl border p-8 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-muted relative h-14 w-14 overflow-hidden rounded-full border-2 border-blue-500/20">
                {review.user.image ? (
                  <Image
                    src={review.user.image}
                    alt={review.user.firstName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground bg-secondary/50 flex h-full w-full items-center justify-center">
                    <User size={24} />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-foreground text-lg font-black tracking-tight">
                  {review.user.firstName} {review.user.lastName}
                </h4>
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex gap-1 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < review.rating ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed font-medium italic">
            "{review.comment}"
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default ReviewList;

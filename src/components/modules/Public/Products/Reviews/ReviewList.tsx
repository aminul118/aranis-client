'use client';

import { Star, User } from 'lucide-react';
import { IReview } from '@/services/review/review';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ReviewListProps {
    reviews: IReview[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
                <p className="text-muted-foreground font-medium">Be the first to share your thoughts on this masterpiece.</p>
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
                    className="p-8 bg-card rounded-3xl border border-border/50 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted border-2 border-blue-500/20">
                                {review.user.image ? (
                                    <Image
                                        src={review.user.image}
                                        alt={review.user.firstName}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">
                                        <User size={24} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-black text-foreground text-lg tracking-tight">
                                    {review.user.firstName} {review.user.lastName}
                                </h4>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-1 text-amber-500 bg-amber-500/5 px-3 py-1.5 rounded-full border border-amber-500/20">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    fill={i < review.rating ? 'currentColor' : 'none'}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-lg font-medium italic">
                        "{review.comment}"
                    </p>
                </motion.div>
            ))}
        </div>
    );
};

export default ReviewList;

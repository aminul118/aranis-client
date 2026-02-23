'use client';

import { useState } from 'react';
import { Star, X, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { toast } from 'sonner';

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

const StarRating = ({
    value,
    onChange,
}: {
    value: number;
    onChange: (v: number) => void;
}) => {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-125"
                >
                    <Star
                        size={24}
                        className={cn(
                            'transition-colors',
                            star <= (hovered || value)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground'
                        )}
                    />
                </button>
            ))}
        </div>
    );
};

const WriteReviewModal = ({ open, onClose, items }: Props) => {
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [comments, setComments] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        const allRated = items.every((item) => (ratings[item.productId] ?? 0) > 0);
        if (!allRated) {
            toast.error('Please rate all products before submitting.');
            return;
        }
        setSubmitting(true);
        // Simulate API call (review API to be integrated when endpoint is ready)
        await new Promise((r) => setTimeout(r, 1000));
        setSubmitting(false);
        setSubmitted(true);
    };

    const handleClose = () => {
        setSubmitted(false);
        setRatings({});
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
                    className="relative z-10 w-full max-w-lg bg-background border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/20">
                        <div>
                            <h2 className="text-xl font-black tracking-tight">Write a Review</h2>
                            <p className="text-sm text-muted-foreground">Share your experience</p>
                        </div>
                        <button onClick={handleClose} className="rounded-full p-2 hover:bg-muted transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-black">Thank You!</h3>
                                <p className="text-muted-foreground">
                                    Your review has been submitted. It helps other shoppers discover great products.
                                </p>
                                <Button onClick={handleClose} className="rounded-full px-8 bg-emerald-600 hover:bg-emerald-700 mt-2">
                                    Done
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {items.map((item) => (
                                    <div key={item.productId} className="space-y-4">
                                        {/* Product */}
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                                                <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm leading-tight">{item.productName}</p>
                                                <p className="text-xs text-muted-foreground">Rate your purchase</p>
                                            </div>
                                        </div>

                                        {/* Star rating */}
                                        <StarRating
                                            value={ratings[item.productId] ?? 0}
                                            onChange={(v) => setRatings((prev) => ({ ...prev, [item.productId]: v }))}
                                        />

                                        {/* Comment */}
                                        <textarea
                                            value={comments[item.productId] ?? ''}
                                            onChange={(e) =>
                                                setComments((prev) => ({ ...prev, [item.productId]: e.target.value }))
                                            }
                                            placeholder="Share what you loved (or didn't)..."
                                            rows={3}
                                            className="w-full rounded-xl bg-muted/50 border border-border p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                                        />

                                        {items.length > 1 && <hr className="border-border/50" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {!submitted && (
                        <div className="px-6 py-4 border-t border-border bg-muted/10">
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full rounded-full py-6 bg-blue-600 hover:bg-blue-700 font-bold text-base gap-2"
                            >
                                {submitting ? 'Submitting...' : (
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

'use client';

import { useState } from 'react';
import { Star, Send, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createReview } from '@/services/review/review';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewFormProps {
    productId: string;
    onSuccess: () => void;
}

const ReviewForm = ({ productId, onSuccess }: ReviewFormProps) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        if (comment.length < 5) {
            toast.error('Comment must be at least 5 characters');
            return;
        }

        setSubmitting(true);
        try {
            const res = await createReview({ product: productId, rating, comment });
            if (res.success) {
                toast.success('Thank you for your review!');
                setRating(0);
                setComment('');
                onSuccess();
            } else {
                toast.error(res.message || 'Failed to submit review');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl border border-border/50 p-8 shadow-2xl shadow-blue-500/5"
        >
            <div className="flex items-center gap-2 text-blue-600 mb-6">
                <ShieldCheck size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Verified Purchase Review</span>
            </div>

            <h3 className="text-2xl font-black text-foreground mb-4">Share Your Experience</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Your Rating</p>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-all transform hover:scale-125 focus:outline-none"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    size={32}
                                    className={`transition-colors ${star <= (hoverRating || rating)
                                            ? 'text-amber-500 fill-amber-500'
                                            : 'text-muted-foreground/30'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Your Perspective</p>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What was your experience with this product? The material, the fit, the artisanal quality..."
                        className="w-full min-h-[150px] p-6 rounded-2xl bg-muted/30 border border-border/50 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-foreground font-medium resize-none"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-7 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]"
                >
                    {submitting ? 'Authenticating...' : 'Publish Review'}
                    <Send className="ml-3 h-5 w-5" />
                </Button>
            </form>
        </motion.div>
    );
};

export default ReviewForm;

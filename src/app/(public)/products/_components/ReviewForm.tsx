'use client';

import { Button } from '@/components/ui/button';
import { createReview } from '@/services/review/review';
import { motion } from 'framer-motion';
import { Send, ShieldCheck, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
      className="bg-card border-border/50 rounded-3xl border p-8 shadow-2xl shadow-blue-500/5"
    >
      <div className="mb-6 flex items-center gap-2 text-blue-600">
        <ShieldCheck size={20} />
        <span className="text-xs font-black tracking-widest uppercase">
          Verified Purchase Review
        </span>
      </div>

      <h3 className="text-foreground mb-4 text-2xl font-black">
        Share Your Experience
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-black tracking-widest uppercase">
            Your Rating
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`Rate ${star} stars`}
                className="transform transition-all hover:scale-125 focus:outline-none"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={32}
                  className={`transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-muted-foreground/30'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-muted-foreground mb-3 text-xs font-black tracking-widest uppercase">
            Your Perspective
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What was your experience with this product? The material, the fit, the artisanal quality..."
            className="bg-muted/30 border-border/50 text-foreground min-h-[150px] w-full resize-none rounded-2xl border p-6 font-medium transition-all outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-blue-600 py-7 text-lg font-black text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
        >
          {submitting ? 'Authenticating...' : 'Publish Review'}
          <Send className="ml-3 h-5 w-5" />
        </Button>
      </form>
    </motion.div>
  );
};

export default ReviewForm;

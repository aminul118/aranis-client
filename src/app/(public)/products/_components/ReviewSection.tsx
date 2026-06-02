'use client';

import { Button } from '@/components/ui/button';
import {
  checkReviewEligibility,
  getProductReviews,
  IReview,
} from '@/services/review/review';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const reviewsRes = await getProductReviews(productId);
      if (reviewsRes.success) setReviews(reviewsRes.data || []);

      const eligibilityRes = await checkReviewEligibility(productId);
      if (eligibilityRes.success) {
        setIsEligible(eligibilityRes.data?.eligible || false);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Failed to fetch reviews data', error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-muted-foreground text-xs font-black tracking-[0.3em] uppercase">
          Synthesizing Feedback
        </p>
      </div>
    );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="border-border/50 border-t py-24">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        {/* Review Sidebar / Summary */}
        <div className="space-y-12 lg:col-span-4">
          <div>
            <h2 className="text-foreground mb-4 text-4xl font-black tracking-tighter italic">
              Community Insights
            </h2>
            <div className="mb-8 flex items-center gap-6">
              <div className="text-6xl font-black tracking-tighter text-blue-600">
                {averageRating.toFixed(1)}
              </div>
              <div>
                <div className="mb-1 flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill={
                        i < Math.floor(averageRating) ? 'currentColor' : 'none'
                      }
                    />
                  ))}
                </div>
                <p className="text-muted-foreground text-xs font-black tracking-widest uppercase">
                  Based on {reviews.length} Experiences
                </p>
              </div>
            </div>
          </div>

          {isEligible && (
            <ReviewForm productId={productId} onSuccess={fetchData} />
          )}

          {!isLoggedIn && (
            <div className="bg-muted/30 border-border/50 rounded-3xl border p-8">
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                Join the Aranis community to share your perspective on this
                collectible.
              </p>
              <div className="mt-4">
                <Button
                  asChild
                  variant="link"
                  className="h-auto p-0 font-bold text-blue-600"
                >
                  <Link href="/login">Sign in to Review</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-8">
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;

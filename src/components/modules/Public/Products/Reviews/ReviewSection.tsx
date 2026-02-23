'use client';

import { useEffect, useState, useCallback } from 'react';
import { getProductReviews, checkReviewEligibility, IReview } from '@/services/review/review';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

    if (loading) return (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Synthesizing Feedback</p>
        </div>
    );

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return (
        <section className="py-24 border-t border-border/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Review Sidebar / Summary */}
                <div className="lg:col-span-4 space-y-12">
                    <div>
                        <h2 className="text-4xl font-black text-foreground mb-4 tracking-tighter italic">Community Insights</h2>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="text-6xl font-black text-blue-600 tracking-tighter">
                                {averageRating.toFixed(1)}
                            </div>
                            <div>
                                <div className="flex text-amber-500 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={20} fill={i < Math.floor(averageRating) ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                    Based on {reviews.length} Experiences
                                </p>
                            </div>
                        </div>
                    </div>

                    {isEligible && (
                        <ReviewForm productId={productId} onSuccess={fetchData} />
                    )}

                    {!isLoggedIn && (
                        <div className="p-8 bg-muted/30 rounded-3xl border border-border/50">
                            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                Join the Lumiere community to share your perspective on this collectible.
                            </p>
                            <div className="mt-4">
                                <Button asChild variant="link" className="p-0 h-auto text-blue-600 font-bold">
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

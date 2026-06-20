import generateMetaTags from '@/seo/generateMetaTags';
import { Metadata } from 'next';
import TrackOrderContent from './_components/TrackOrderContent';

export default function TrackOrderPage() {
  return (
    <div className="bg-background relative min-h-screen overflow-hidden px-4 pt-32 pb-20">
      {/* Background Orbs for "Cute/Premium" Look */}
      <div className="absolute top-0 left-1/4 -z-10 h-64 w-64 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 -z-10 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-700" />

      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-foreground mb-4 text-3xl font-black tracking-tight md:text-5xl">
            Track Your <span className="text-blue-500">Journey</span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-lg text-sm md:text-base">
            Enter your Tracking Number to see where your premium pieces are in
            their journey to your doorstep.
          </p>
        </div>

        <Suspense fallback={null}>
          <TrackOrderContent />
        </Suspense>
      </div>
    </div>
  );
}

export const metadata: Metadata = generateMetaTags({
  title: 'Track Order | Aranis Fashion',
  description:
    'Real-time tracking of your Aranis Fashion premium order. Enter your Tracking Number to track the courier journey in real-time.',
  keywords:
    'track order, order tracking, Aranis Fashion, premium clothing tracking, delivery status',
  image: '/seo/aminul-hero-ss.png',
  websitePath: '/track-order',
});

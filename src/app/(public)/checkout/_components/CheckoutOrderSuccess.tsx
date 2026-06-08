import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutOrderSuccess() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 pt-32 pb-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card/40 w-full max-w-xl overflow-hidden rounded-[32px] border border-emerald-500/10 p-6 text-center shadow-2xl shadow-emerald-500/10 backdrop-blur-3xl sm:rounded-[48px] sm:p-12"
      >
        <div className="relative mx-auto mb-6 h-24 w-24 sm:mb-10 sm:h-32 sm:w-32">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/40 sm:h-32 sm:w-32">
            <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
        </div>
        <h1 className="mb-4 text-3xl font-black tracking-tighter uppercase italic sm:text-5xl">
          Order <span className="text-emerald-500">Confirmed</span>
        </h1>
        <p className="text-muted-foreground/60 mb-8 text-sm leading-relaxed font-medium sm:mb-10 sm:text-lg">
          Thank you for shopping with Aranis. Your order has been placed
          successfully and is now being processed. We'll notify you when it's
          shipped!
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            className="h-14 w-full rounded-full bg-emerald-500 px-8 text-sm font-black tracking-widest text-white uppercase shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 hover:bg-emerald-600 active:scale-95 sm:w-auto sm:px-10 sm:text-base"
          >
            <Link href="/user/orders">View Your Orders</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-border bg-card/50 hover:bg-muted h-14 w-full rounded-full px-8 text-sm font-black tracking-widest uppercase transition-all active:scale-95 sm:w-auto sm:px-10 sm:text-base"
          >
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { IUser } from '@/types';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface CheckoutAdminBlockedProps {
  user: IUser | null;
}

export default function CheckoutAdminBlocked({
  user,
}: CheckoutAdminBlockedProps) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center pt-32 pb-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-4 w-full max-w-lg text-center"
      >
        {/* Icon */}
        <div className="relative mx-auto mb-8 h-24 w-24">
          <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/10" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-500/30 bg-amber-500/10">
            <ShieldAlert className="h-10 w-10 text-amber-500" />
          </div>
        </div>

        {/* Message */}
        <h1 className="mb-3 text-3xl font-black tracking-tighter">
          Admin Account <span className="text-amber-500">Detected</span>
        </h1>
        <p className="text-muted-foreground mb-2 leading-relaxed">
          You are logged in as{' '}
          <span className="text-foreground font-bold">{user?.role}</span>.
        </p>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Admin and Super Admin accounts are{' '}
          <span className="font-bold text-amber-500">not permitted</span> to
          place orders on the platform. Please use a regular customer account to
          shop.
        </p>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className="rounded-full bg-amber-500 px-8 font-bold text-white hover:bg-amber-600"
          >
            <Link href="/admin">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link href="/">Back to Homepage</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

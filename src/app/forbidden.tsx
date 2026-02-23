'use client';

import BackButton from '@/components/common/button/back-button';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Home, ShieldBan } from 'lucide-react';
import Link from 'next/link';

const Forbidden = () => {
  return (
    <div className="text-foreground relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
      {/* Background Grids & Gradients */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="h-full w-full bg-[radial-gradient(#333_1px,transparent_1px)] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-size-[16px_16px]" />
      </div>

      <div className="pointer-events-none absolute top-[-10%] left-[-10%] z-0 h-64 w-64 rounded-full bg-amber-500/10 blur-[80px] sm:h-[400px] sm:w-[400px] md:blur-[100px] lg:h-[500px] lg:w-[500px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] z-0 h-64 w-64 rounded-full bg-red-500/10 blur-[80px] sm:h-[400px] sm:w-[400px] md:blur-[100px] lg:h-[500px] lg:w-[500px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-3xl px-4 text-center"
      >
        <div className="relative mx-auto mb-6 flex items-center justify-center sm:mb-8">
          <motion.div className="relative">
            <motion.h1
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.8,
                type: 'spring',
                stiffness: 80,
              }}
              className="text-8xl leading-none font-black tracking-tighter text-transparent select-none sm:text-[10rem] md:text-[12rem] lg:text-[14rem]"
              style={{
                WebkitTextStroke: '2px rgba(255, 255, 255, 0.1)',
              }}
            >
              <span className="bg-linear-to-b from-amber-500 to-red-600 bg-clip-text">
                4
              </span>
              <span className="relative inline-block text-zinc-800">
                0
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
                >
                  <ShieldBan className="h-20 w-20 text-zinc-900/50 sm:h-32 sm:w-32" />
                </motion.div>
                {/* Lock icon overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <ShieldBan className="hidden h-full w-full stroke-1 text-zinc-800/20 sm:block" />
                </div>
              </span>
              <span className="bg-linear-to-b from-red-600 to-amber-500 bg-clip-text">
                3
              </span>
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-medium text-amber-400 shadow-sm backdrop-blur-md sm:bottom-4 sm:px-4 sm:py-1.5 sm:text-sm"
          >
            Access Denied
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-auto max-w-lg space-y-6"
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              Restricted Area
            </h2>
            <p className="text-base text-gray-400 sm:text-lg">
              You don't have permission to access this resource. If you believe
              this is an error, please contact the administrator.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <div className="w-full sm:w-auto">
              <BackButton
                variant="outline"
                className="h-10 w-full gap-2 rounded-full border-zinc-800 bg-black text-sm text-white hover:bg-zinc-900 hover:text-white sm:h-12 sm:w-auto sm:px-8 sm:text-base"
              />
            </div>
            <Button
              asChild
              size="lg"
              className="h-10 w-full gap-2 rounded-full bg-amber-600 text-sm text-black shadow-lg shadow-amber-500/25 transition-transform hover:scale-105 hover:bg-amber-500 sm:h-12 sm:w-auto sm:px-8 sm:text-base"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Forbidden;

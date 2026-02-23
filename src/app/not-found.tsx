'use client';

import BackButton from '@/components/common/button/back-button';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="text-foreground relative flex min-h-screen w-full items-center justify-center overflow-hidden dark:bg-black">
      {/* Background Grids & Gradients */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
        <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-size-[16px_16px] dark:bg-[radial-gradient(#333_1px,transparent_1px)]" />
      </div>

      <div className="pointer-events-none absolute top-[-10%] left-[-10%] z-0 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px] sm:h-[400px] sm:w-[400px] md:blur-[100px] lg:h-[500px] lg:w-[500px] dark:bg-blue-500/20" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] z-0 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px] sm:h-[400px] sm:w-[400px] md:blur-[100px] lg:h-[500px] lg:w-[500px] dark:bg-purple-500/20" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-3xl px-4 text-center"
      >
        <div className="relative mx-auto mb-6 flex items-center justify-center sm:mb-8">
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
              WebkitTextStroke: '2px rgba(var(--foreground-rgb), 0.1)',
            }}
          >
            <span className="bg-linear-to-b from-blue-600 to-purple-600 bg-clip-text dark:from-blue-400 dark:to-purple-500">
              4
            </span>
            <span className="relative inline-block text-gray-200 dark:text-zinc-800">
              0
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute top-1/2 left-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-blue-500/30 opacity-50"
              />
            </span>
            <span className="bg-linear-to-b from-purple-600 to-blue-600 bg-clip-text dark:from-purple-500 dark:to-blue-400">
              4
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-blue-600 shadow-sm backdrop-blur-md sm:bottom-4 sm:px-4 sm:py-1.5 sm:text-sm dark:bg-zinc-900/80 dark:text-blue-400"
          >
            Error Code: 404
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-auto max-w-lg space-y-6"
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl md:text-4xl">
              Lost in Space?
            </h2>
            <p className="text-base text-gray-400 sm:text-lg">
              The page you are looking for has been moved, deleted, or possibly
              never existed.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <div className="w-full sm:w-auto">
              <BackButton
                variant="outline"
                className="w-full gap-2 rounded-full border-gray-200 bg-black text-sm text-white hover:bg-gray-800 hover:text-white sm:h-12 sm:w-auto sm:px-8 sm:text-base dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
              />
            </div>
            <Button
              asChild
              className="bg-primary w-full gap-2 rounded-full text-sm text-white shadow-lg shadow-blue-500/25 transition-transform hover:bg-blue-700 sm:h-12 sm:w-auto sm:px-8 sm:text-base dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Link href="/">
                <Home />
                Back to Home
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;

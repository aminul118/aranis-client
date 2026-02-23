'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertOctagon, RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';

// Make sure to define proper types for the props
interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="text-foreground bg-black antialiased">
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans">
          {/* Background Grids & Gradients */}
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="h-full w-full bg-[radial-gradient(#333_1px,transparent_1px)] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-size-[16px_16px]" />
          </div>

          <div className="pointer-events-none absolute top-[-10%] left-[-10%] z-0 h-64 w-64 rounded-full bg-red-500/10 blur-[80px] sm:h-[400px] sm:w-[400px] md:blur-[100px] lg:h-[500px] lg:w-[500px]" />
          <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] z-0 h-64 w-64 rounded-full bg-orange-500/10 blur-[80px] sm:h-[400px] sm:w-[400px] md:blur-[100px] lg:h-[500px] lg:w-[500px]" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-3xl px-4 text-center"
          >
            <div className="relative mx-auto mb-6 flex items-center justify-center sm:mb-8">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.8,
                  type: 'spring',
                  stiffness: 80,
                }}
                className="relative"
              >
                {/* Glitchy 500 Text */}
                <h1
                  className="text-8xl leading-none font-black tracking-tighter text-transparent select-none sm:text-[10rem] md:text-[12rem] lg:text-[14rem]"
                  style={{
                    WebkitTextStroke: '2px rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span className="bg-linear-to-b from-red-600 to-orange-600 bg-clip-text">
                    5
                  </span>
                  <span className="relative inline-block text-zinc-800">
                    0
                    <div className="absolute top-1/2 left-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-double border-red-500/20" />
                  </span>
                  <span className="bg-linear-to-b from-orange-600 to-red-600 bg-clip-text">
                    0
                  </span>
                </h1>

                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8"
                >
                  <AlertOctagon className="h-12 w-12 text-red-500/50 sm:h-20 sm:w-20" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-medium text-red-400 shadow-sm backdrop-blur-md sm:bottom-4 sm:px-4 sm:py-1.5 sm:text-sm"
              >
                System Failure
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
                  Something went wrong!
                </h2>
                <p className="text-base text-gray-400 sm:text-lg">
                  A critical system error occurred. We apologize for the
                  inconvenience. Our team has been notified.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <Button
                  size="lg"
                  onClick={() => reset()}
                  className="h-10 w-full gap-2 rounded-full bg-red-600 text-sm text-white shadow-lg shadow-red-500/25 transition-transform hover:scale-105 hover:bg-red-700 sm:h-12 sm:w-auto sm:px-8 sm:text-base"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;

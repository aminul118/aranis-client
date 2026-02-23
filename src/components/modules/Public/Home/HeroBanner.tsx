'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import images from '@/constants/images';
import Image from 'next/image';
import { motion } from 'framer-motion';

const HeroBanner = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-slate-950 px-3 pt-20">
      {/* Background Glow Effects - More subtle for fashion */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[100px]" />

      <div className="relative container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="z-10 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest text-blue-400 uppercase bg-blue-500/10 rounded-full">
              New Collection 2026
            </span>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
                Signature Style
              </span>
            </h1>
            <p className="max-w-xl mx-auto lg:mx-0 text-lg text-slate-400 mb-10 leading-relaxed">
              Discover the latest trends in premium fashion. Lumiere brings you curated
              collections that blend contemporary design with timeless elegance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="rounded-full px-8 py-6 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg hover:shadow-blue-500/25">
                Shop Collection <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-base font-bold border-white/10 text-white hover:bg-white/5 transition-all">
                View Lookbook
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Right Content - Fashion Image */}
        <div className="relative order-first lg:order-last">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 mx-auto max-w-[500px] lg:max-w-none shadow-2xl rounded-2xl overflow-hidden"
          >
            <div className="aspect-4/5 relative bg-slate-900 overflow-hidden rounded-2xl border border-white/5 group">
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
                fill
                alt="High Fashion Collection"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
            </div>

            {/* Floating Info Cards */}
            <div className="absolute top-10 -left-6 z-20 hidden xl:block">
              <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl">
                <p className="text-xs text-slate-400 uppercase tracking-tighter mb-1">Featured Item</p>
                <p className="font-bold text-white text-sm">Lumiere Nocturne Jacket</p>
              </div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <div className="w-px h-12 bg-linear-to-b from-blue-500 to-transparent" />
      </div>
    </section>
  );
};

export default HeroBanner;

'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, CreditCard, Home } from 'lucide-react';

interface CheckoutPaymentSectionProps {
  paymentMethod: 'COD' | 'CARD';
  setPaymentMethod: (method: 'COD' | 'CARD') => void;
}

export default function CheckoutPaymentSection({
  paymentMethod,
  setPaymentMethod,
}: CheckoutPaymentSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card/50 border-border rounded-3xl border p-8"
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
          <CreditCard size={20} />
        </div>
        <h2 className="text-xl font-bold">Select Payment Flow</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          onClick={() => setPaymentMethod('COD')}
          className={`relative flex flex-col items-start gap-4 rounded-2xl border-2 p-6 transition-all ${
            paymentMethod === 'COD'
              ? 'border-blue-600 bg-blue-500/5'
              : 'border-border bg-muted/20 hover:border-blue-500/30'
          }`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              paymentMethod === 'COD'
                ? 'bg-blue-600 text-white'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Home size={20} />
          </div>
          <div className="text-left">
            <p className="text-foreground font-black">Cash on Delivery</p>
            <p className="text-muted-foreground text-xs">
              Pay at your doorstep
            </p>
          </div>
          {paymentMethod === 'COD' && (
            <CheckCircle2
              className="absolute top-4 right-4 text-blue-600"
              size={20}
            />
          )}
        </button>

        <button
          onClick={() => setPaymentMethod('CARD')}
          className={`flex cursor-not-allowed flex-col items-start gap-4 rounded-2xl border-2 p-6 opacity-50 transition-all ${
            paymentMethod === 'CARD'
              ? 'border-blue-600 bg-blue-500/5'
              : 'border-border bg-muted/20'
          }`}
          disabled
        >
          <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full">
            <CreditCard size={20} />
          </div>
          <div className="text-left">
            <p className="text-foreground font-black">Card Payment</p>
            <p className="text-muted-foreground text-xs italic underline">
              Coming Soon
            </p>
          </div>
        </button>
      </div>
    </motion.section>
  );
}

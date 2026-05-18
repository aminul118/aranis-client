'use client';

import { trackOrder } from '@/services/order/order';
import { IOrder } from '@/services/order/order.types';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DeliveryDetailsCard from './DeliveryDetailsCard';
import OrderItemsCard from './OrderItemsCard';
import OrderProgressTimeline from './OrderProgressTimeline';
import TrackOrderSearch from './TrackOrderSearch';

export default function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: 'error' | 'success';
  } | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      handleTrackAuto(id);
    }
  }, [searchParams]);

  const handleTrackAuto = async (id: string) => {
    try {
      setLoading(true);
      setMessage(null);
      const res = await trackOrder(id.trim());
      if (res.success) {
        setOrder(res.data!);
        setMessage({
          text: 'Order found! Tracking details updated.',
          type: 'success',
        });
      } else {
        setMessage({
          text: "Oops! We couldn't find that order ID. Please double check.",
          type: 'error',
        });
        setOrder(null);
      }
    } catch (error) {
      setMessage({
        text: 'Something went wrong. Please try again later.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    try {
      setLoading(true);
      setMessage(null);
      const res = await trackOrder(orderId.trim());
      if (res.success) {
        setOrder(res.data!);
        setMessage({
          text: 'Order found! Scroll down for details.',
          type: 'success',
        });
      } else {
        setMessage({
          text: "Oops! We couldn't find that order ID. Please double check.",
          type: 'error',
        });
        setOrder(null);
      }
    } catch (error) {
      setMessage({
        text: 'Something went wrong. Please try again later.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TrackOrderSearch
        orderId={orderId}
        setOrderId={setOrderId}
        loading={loading}
        message={message}
        onTrack={handleTrack}
      />

      <AnimatePresence mode="wait">
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="mt-16 space-y-12"
          >
            {/* Progress Tracker */}
            <OrderProgressTimeline order={order} />

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {/* Items */}
              <OrderItemsCard order={order} />

              {/* Shipping & Payment Details */}
              <DeliveryDetailsCard order={order} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

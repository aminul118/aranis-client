'use client';

import { IOffer } from '@/services/offer/offer';
import { useEffect, useState } from 'react';

interface Props {
  offer: IOffer;
}

export default function OfferCountdown({ offer }: Props) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isStarted, setIsStarted] = useState(true);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const startDate = new Date(offer.startDate).getTime();
      const endDate = new Date(offer.endDate).getTime();

      let targetDate = endDate;

      if (now < startDate) {
        setIsStarted(false);
        targetDate = startDate;
      } else if (now >= endDate) {
        setIsEnded(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      } else {
        setIsStarted(true);
      }

      const difference = targetDate - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [offer]);

  if (isEnded) return null;

  return (
    <div className="mb-12 flex flex-col items-center justify-center">
      <h2 className="mb-6 text-center text-xl font-black tracking-widest uppercase md:text-2xl">
        {isStarted ? 'Offer Ends In' : 'Offer Starts In'}
      </h2>
      <div className="flex items-center justify-center gap-4 md:gap-8">
        <TimeBlock value={timeLeft.days} label="Days" />
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <TimeBlock value={timeLeft.minutes} label="Minutes" />
        <TimeBlock value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
}

const TimeBlock = ({ value, label }: { value: number; label: string }) => {
  const formattedValue = value.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1">
        {formattedValue.split('').map((digit, i) => (
          <div
            key={i}
            className="flex h-12 w-10 items-center justify-center rounded-lg bg-[#DE4E33] text-2xl font-bold text-white shadow-lg md:h-16 md:w-12 md:text-3xl"
          >
            {digit}
          </div>
        ))}
      </div>
      <span className="text-muted-foreground mt-2 text-xs font-semibold tracking-wider uppercase md:text-sm">
        {label}
      </span>
    </div>
  );
};

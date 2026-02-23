'use client';

import { format } from 'date-fns';

interface DateFormatProps {
  date: Date | string | number; // accepts Date object, ISO string, or timestamp
}

const DateFormat = ({ date }: DateFormatProps) => {
  const formattedDate = format(new Date(date), 'dd MMM yyyy - hh:mm a');

  return <span className="ml-1">{formattedDate}</span>;
};

export default DateFormat;

import { OrderStatus } from '@/services/order/order.types';
import {
  Ban,
  CheckCircle2,
  Clock,
  Loader2,
  Package,
  Truck,
  Undo2,
  XCircle,
} from 'lucide-react';

const GetStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return (
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-black tracking-widest text-amber-500 uppercase">
          <Clock size={12} /> {status}
        </span>
      );
    case OrderStatus.PROCESSING:
      return (
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-black tracking-widest text-blue-500 uppercase">
          <Loader2 size={12} className="animate-spin" /> {status}
        </span>
      );
    case OrderStatus.SHIPPED:
      return (
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-1 text-[10px] font-black tracking-widest text-purple-500 uppercase">
          <Truck size={12} /> {status}
        </span>
      );
    case OrderStatus.COURIER:
      return (
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] font-black tracking-widest text-indigo-500 uppercase">
          <Package size={12} /> {status}
        </span>
      );
    case OrderStatus.DELIVERED:
      return (
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black tracking-widest text-emerald-500 uppercase">
          <CheckCircle2 size={12} /> {status}
        </span>
      );
    case OrderStatus.CANCELLED:
      return (
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-black tracking-widest text-red-500 uppercase">
          <XCircle size={12} /> {status}
        </span>
      );
    case OrderStatus.REJECTED:
      return (
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-red-600/10 px-2.5 py-1 text-[10px] font-black tracking-widest text-red-600 uppercase">
          <Ban size={12} /> {status}
        </span>
      );
    case OrderStatus.RETURNED:
      return (
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 text-[10px] font-black tracking-widest text-orange-500 uppercase">
          <Undo2 size={12} /> {status}
        </span>
      );
    default:
      return (
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-gray-500/10 px-2.5 py-1 text-[10px] font-black tracking-widest text-gray-500 uppercase">
          {status}
        </span>
      );
  }
};

export default GetStatusBadge;

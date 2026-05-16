'use client';

import { Column } from '@/components/common/table/TableManageMent';
import { Badge } from '@/components/ui/badge';
import { ILocation } from '@/services/location/location';
import { Clock, MapPin, Phone } from 'lucide-react';

const LocationColumn: Column<ILocation>[] = [
  {
    header: 'SI',
    accessor: (_, __, globalIndex) => (
      <span className="font-bold text-zinc-500">{globalIndex}</span>
    ),
    className: 'w-[50px]',
  },
  {
    header: 'Outlet Name',
    accessor: (row) => (
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400">
          <MapPin size={16} />
        </div>
        <span className="font-black tracking-tight text-white uppercase italic">
          {row.name}
        </span>
      </div>
    ),
  },
  {
    header: 'Address',
    accessor: (row) => (
      <span className="block max-w-[200px] truncate text-xs font-medium text-zinc-400 italic">
        {row.address}
      </span>
    ),
  },
  {
    header: 'Contact',
    accessor: (row) => (
      <div className="flex items-center gap-2 text-zinc-400">
        <Phone size={12} className="text-emerald-500" />
        <span className="text-xs font-bold">{row.phone}</span>
      </div>
    ),
  },
  {
    header: 'Hours',
    accessor: (row) => (
      <div className="flex items-center gap-2 text-zinc-400">
        <Clock size={12} className="text-amber-500" />
        <span className="text-xs font-bold">{row.hours}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    accessor: (row) => (
      <Badge
        variant={row.isActive ? 'default' : 'secondary'}
        className={
          row.isActive
            ? 'border-emerald-500/20 bg-emerald-500/10 text-[10px] font-black text-emerald-400 uppercase'
            : 'border-zinc-500/20 bg-zinc-500/10 text-[10px] font-black text-zinc-400 uppercase'
        }
      >
        {row.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];

export default LocationColumn;

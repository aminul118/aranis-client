'use client';

import { Column } from '@/components/common/table/TableManageMent';
import { Badge } from '@/components/ui/badge';
import { IOffer } from '@/services/offer/offer';
import { format } from 'date-fns';
import OfferActions from './OfferActions';

export const getOfferColumns = (
  onEdit: (offer: IOffer) => void,
): Column<IOffer>[] => [
  {
    header: 'SI',
    accessor: (_, __, globalIndex) => globalIndex,
  },
  {
    header: 'Offer Name',
    accessor: (o) => (
      <span className="text-foreground font-bold">{o.name}</span>
    ),
    sortKey: 'name',
  },
  {
    header: 'Tag',
    accessor: (o) => (
      <Badge variant="outline" className="font-mono">
        {o.tag}
      </Badge>
    ),
    sortKey: 'tag',
  },
  {
    header: 'Discount (%)',
    accessor: (o) => (
      <span className="font-black text-blue-500">{o.discountPercentage}%</span>
    ),
    sortKey: 'discountPercentage',
  },
  {
    header: 'Start Date',
    accessor: (o) => (
      <span className="text-muted-foreground text-xs">
        {format(new Date(o.startDate), 'dd MMM yyyy')}
      </span>
    ),
    sortKey: 'startDate',
  },
  {
    header: 'End Date',
    accessor: (o) => (
      <span className="text-muted-foreground text-xs font-medium">
        {format(new Date(o.endDate), 'dd MMM yyyy')}
      </span>
    ),
    sortKey: 'endDate',
  },
  {
    header: 'Status',
    accessor: (o) => {
      const isExpired = new Date(o.endDate) < new Date();
      return (
        <Badge variant={o.isActive && !isExpired ? 'default' : 'secondary'}>
          {isExpired ? 'Expired' : o.isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
    sortKey: 'isActive',
  },
  {
    header: 'Actions',
    accessor: (o) => <OfferActions offer={o} onEdit={onEdit} />,
  },
];

import { Column } from '@/components/common/table/TableManageMent';
import type { IGiftCard } from '@/services/giftcard/giftcard.interface';
import Image from 'next/image';
import GiftCardActions from './GiftCardActions';

const GiftCardsColumn: Column<IGiftCard>[] = [
  {
    header: 'SI',
    accessor: (_, __, globalIndex) => globalIndex,
  },
  {
    header: 'Image',
    accessor: (g) => (
      <Image
        src={g.image}
        alt={g.name}
        width={40}
        height={40}
        className="h-10 w-10 rounded-md object-cover"
      />
    ),
  },
  {
    header: 'Name',
    accessor: (g) => <span className="font-semibold">{g.name}</span>,
    sortKey: 'name',
  },
  {
    header: 'Price',
    accessor: (g) => `$${g.price.toFixed(2)}`,
    sortKey: 'price',
  },
  {
    header: 'Validity (Days)',
    accessor: (g) => g.validityDays,
  },
  {
    header: 'Status',
    accessor: (g) => (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${g.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
      >
        {g.status}
      </span>
    ),
  },
  {
    header: 'Actions',
    accessor: (g) => <GiftCardActions giftCard={g} />,
  },
];

export default GiftCardsColumn;

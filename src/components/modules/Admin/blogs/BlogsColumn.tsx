import DateFormat from '@/components/common/formater/date-format';
import PlaceHolderImage from '@/components/common/PlaceHolderImage';
import { Column } from '@/components/common/table/TableManageMent';
import { IBlog } from '@/types';
import Image from 'next/image';
import BlogActions from './BlogActions';

const BlogsColumn: Column<IBlog>[] = [
  {
    header: 'SI',
    accessor: (_, i) => i + 1,
  },
  {
    header: 'Photo',
    accessor: (b) =>
      b.thumbnail ? (
        <Image
          src={b.thumbnail}
          alt={b.title}
          width={60}
          height={60}
          className="h-12 w-12 rounded-md object-cover"
        />
      ) : (
        <PlaceHolderImage />
      ),
  },
  {
    header: 'Title',
    accessor: (b) => <span className="font-semibold">{b.title}</span>,
  },
  {
    header: 'Date',
    accessor: (b) => <DateFormat date={b.createdAt} />,
  },
  {
    header: 'Actions',
    accessor: (b) => <BlogActions blog={b} />,
  },
];

export default BlogsColumn;

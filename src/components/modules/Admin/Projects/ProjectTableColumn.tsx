import DateFormat from '@/components/common/formater/date-format';
import PlaceHolderImage from '@/components/common/PlaceHolderImage';
import { Column } from '@/components/common/table/TableManageMent';
import { IProject } from '@/types';
import { Check } from 'lucide-react';
import Image from 'next/image';
import ProjectActions from '../Projects/ProjectActions';

const ProjectTableColumn: Column<IProject>[] = [
  {
    header: 'SI',
    accessor: (_, i) => i + 1,
  },
  {
    header: 'Thumbnail',
    accessor: (p) =>
      p.thumbnail ? (
        <Image
          src={p.thumbnail}
          alt={p.title}
          width={60}
          height={40}
          className="h-8 rounded-md object-cover"
        />
      ) : (
        <PlaceHolderImage />
      ),
  },
  {
    header: 'Title',
    accessor: (p) => p.title,
  },
  {
    header: 'Featured',
    accessor: (p) =>
      p.isFeatured ? (
        <Check size={20} className="text-green-600" />
      ) : (
        <span className="text-gray-500">No</span>
      ),
  },
  {
    header: 'Date & Time',
    accessor: (p) => <DateFormat date={p.createdAt} />,
  },
  {
    header: 'Actions',
    accessor: (p) => <ProjectActions project={p} />,
  },
];

export default ProjectTableColumn;

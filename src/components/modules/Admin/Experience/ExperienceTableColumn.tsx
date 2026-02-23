import { Column } from '@/components/common/table/TableManageMent';
import { IExperience } from '@/types/api.types';
import ExperienceActions from './ExperienceActions';

const ExperienceTableColumn: Column<IExperience>[] = [
  {
    header: 'SI',
    accessor: (_, i) => i + 1,
  },
  {
    header: 'Position',
    accessor: (e) => e.position,
  },
  {
    header: 'Company',
    accessor: (e) => e.companyName,
  },
  {
    header: 'Timeline',
    accessor: (e) => e.timeline,
  },
  {
    header: 'Actions',
    accessor: (e) => <ExperienceActions experience={e} />,
  },
];

export default ExperienceTableColumn;

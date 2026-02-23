'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import { IExperience } from '@/types/api.types';
import ExperienceTableColumn from './ExperienceTableColumn';

const ExperienceTable = ({ experiences }: { experiences: IExperience[] }) => {
  return (
    <>
      <TableManageMent
        columns={ExperienceTableColumn}
        data={experiences}
        getRowKey={(u) => u._id}
      />
    </>
  );
};

export default ExperienceTable;

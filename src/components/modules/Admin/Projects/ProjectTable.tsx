'use client';

import TableManageMent from '@/components/common/table/TableManageMent';
import { IProject } from '@/types';
import ProjectTableColumn from './ProjectTableColumn';

const ProjectTable = ({ projects }: { projects: IProject[] }) => {
  return (
    <>
      <TableManageMent
        columns={ProjectTableColumn}
        data={projects}
        getRowKey={(u) => u._id}
      />
    </>
  );
};

export default ProjectTable;

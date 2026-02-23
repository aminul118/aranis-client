import { IMeta } from '@/types';
import AppPagination from '../pagination/AppPagination';
import GoToPage from '../pagination/GoToPage';
import PaginationStatus from '../pagination/PaginationStatus';

const TablePagination = ({ meta }: { meta?: IMeta }) => {
  if (!meta) return null;

  return (
    <div className="mt-4 flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
      <GoToPage totalPage={meta.totalPage} />
      <div className="flex items-center gap-4">
        <PaginationStatus meta={meta} />
        <AppPagination className="justify-end" meta={meta} />
      </div>
    </div>
  );
};

export default TablePagination;

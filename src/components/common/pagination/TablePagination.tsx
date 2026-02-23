import { IMeta } from '@/types';
import AppPagination from './AppPagination';
import GoToPage from './GoToPage';
import PaginationStatus from './PaginationStatus';

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

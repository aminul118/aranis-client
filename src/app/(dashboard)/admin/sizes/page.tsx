import SizeModal from '@/app/(dashboard)/admin/sizes/_components/SizeModal';
import SizesTable from '@/app/(dashboard)/admin/sizes/_components/SizesTable';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getSizes } from '@/services/size/size';
import { SearchParams } from '@/types';
import { Metadata } from 'next';

const SizePage = async ({ searchParams }: SearchParams) => {
  const resolvedParams = await cleanSearchParams(searchParams);
  const params = { sort: 'order', ...resolvedParams };
  const { data, meta } = await getSizes(params);
  return (
    <ClientTableWrapper tableTitle="Sizes" meta={meta} action={<SizeModal />}>
      <SizesTable sizes={data || []} />
    </ClientTableWrapper>
  );
};

export default SizePage;

export const metadata: Metadata = {
  title: 'Sizes | Admin Portal',
};

import ColorModal from '@/app/admin/colors/_componnets/ColorModal';
import ColorsTable from '@/app/admin/colors/_componnets/ColorsTable';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getColors } from '@/services/color/color';
import { SearchParams } from '@/types';
import { Metadata } from 'next';

const ColorPage = async ({ searchParams }: SearchParams) => {
  const params = await cleanSearchParams(searchParams);
  const { data, meta } = await getColors(params);
  return (
    <ClientTableWrapper tableTitle="Colors" meta={meta} action={<ColorModal />}>
      <ColorsTable colors={data} />
    </ClientTableWrapper>
  );
};

export default ColorPage;

export const metadata: Metadata = {
  title: 'Colors | Admin Portal',
};

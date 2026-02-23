import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import ColorsTable from '@/components/modules/Admin/colors/ColorsTable';
import ColorModal from '@/components/modules/Admin/colors/ColorModal';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getColors } from '@/services/color/color';
import { SearchParams } from '@/types';
import { Metadata } from 'next';

const ColorPage = async ({ searchParams }: SearchParams) => {
    const params = await cleanSearchParams(searchParams);
    const { data, meta } = await getColors(params);
    return (
        <ClientTableWrapper
            tableTitle="Colors"
            meta={meta}
            action={<ColorModal />}
        >
            <ColorsTable colors={data} />
        </ClientTableWrapper>
    );
};

export default ColorPage;

export const metadata: Metadata = {
    title: 'Colors | Admin Portal',
};

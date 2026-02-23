import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import ColorsTable from '@/components/modules/Admin/colors/ColorsTable';
import ColorForm from '@/components/modules/Admin/colors/ColorForm';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getColors } from '@/services/color/color';
import { SearchParams } from '@/types';
import { Metadata } from 'next';

const ColorPage = async ({ searchParams }: SearchParams) => {
    const params = await cleanSearchParams(searchParams);
    const { data, meta } = await getColors(params);
    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <ClientTableWrapper tableTitle="Colors" meta={meta}>
                    <ColorsTable colors={data} />
                </ClientTableWrapper>
            </div>
            <div className="lg:col-span-1">
                <ColorForm />
            </div>
        </div>
    );
};

export default ColorPage;

export const metadata: Metadata = {
    title: 'Colors | Admin Portal',
};

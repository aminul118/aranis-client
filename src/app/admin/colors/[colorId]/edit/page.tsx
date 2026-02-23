import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import ColorForm from '@/components/modules/Admin/colors/ColorForm';
import { getSingleColor } from '@/services/color/color';

export default async function EditColorPage({ params }: { params: { colorId: string } }) {
    const { colorId } = await params;
    const { data } = await getSingleColor(colorId);

    return (
        <ClientTableWrapper tableTitle="Edit color">
            <ColorForm color={data} />
        </ClientTableWrapper>
    );
}

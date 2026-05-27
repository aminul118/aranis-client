import ColorForm from '@/app/admin/colors/_componnets/ColorForm';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { getSingleColor } from '@/services/color/color';

export default async function EditColorPage({
  params,
}: {
  params: { colorId: string };
}) {
  const { colorId } = await params;
  const { data } = await getSingleColor(colorId);

  return (
    <ClientTableWrapper tableTitle="Edit color">
      <ColorForm color={data} />
    </ClientTableWrapper>
  );
}

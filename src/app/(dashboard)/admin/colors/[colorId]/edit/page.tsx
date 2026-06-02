import ColorForm from '@/app/(dashboard)/admin/colors/_componnets/ColorForm';
import BackButton from '@/components/common/BackButton';
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
    <ClientTableWrapper tableTitle="Edit color" action={<BackButton />}>
      <ColorForm color={data} />
    </ClientTableWrapper>
  );
}

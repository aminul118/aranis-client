import NavbarForm from '@/app/admin/navbar/_components/NavbarForm';
import BackButton from '@/components/common/BackButton';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { getSingleNavbar } from '@/services/navbar/navbar';

export const dynamic = 'force-dynamic';

export default async function EditNavbarPage({
  params,
}: {
  params: { navbarId: string };
}) {
  const { navbarId } = await params;
  const { data } = await getSingleNavbar(navbarId);

  return (
    <ClientTableWrapper tableTitle="Edit navbar item" action={<BackButton />}>
      <NavbarForm navbar={data} />
    </ClientTableWrapper>
  );
}

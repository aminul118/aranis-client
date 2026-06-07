import NavbarForm from '@/app/(dashboard)/admin/navbar/_components/NavbarForm';
import BackButton from '@/components/common/BackButton';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';

export const dynamic = 'force-dynamic';

export default function CreateNavbarPage() {
  return (
    <ClientTableWrapper tableTitle="Add Menu Item" action={<BackButton />}>
      <NavbarForm />
    </ClientTableWrapper>
  );
}

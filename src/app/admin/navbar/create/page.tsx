import NavbarForm from '@/app/admin/_components/NavbarForm';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';

export default function CreateNavbarPage() {
  return (
    <ClientTableWrapper tableTitle="Add Menu Item">
      <NavbarForm />
    </ClientTableWrapper>
  );
}

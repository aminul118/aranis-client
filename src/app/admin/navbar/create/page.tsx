import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import NavbarForm from '@/components/modules/Admin/navbar/NavbarForm';

export default function CreateNavbarPage() {
    return (
        <ClientTableWrapper tableTitle="Add Menu Item">
            <NavbarForm />
        </ClientTableWrapper>
    );
}

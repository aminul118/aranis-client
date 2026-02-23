import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import NavbarForm from '@/components/modules/Admin/navbar/NavbarForm';
import { getSingleNavbar } from '@/services/navbar/navbar';

export default async function EditNavbarPage({ params }: { params: { navbarId: string } }) {
    const { navbarId } = await params;
    const { data } = await getSingleNavbar(navbarId);

    return (
        <ClientTableWrapper tableTitle="Edit navbar item">
            <NavbarForm navbar={data} />
        </ClientTableWrapper>
    );
}

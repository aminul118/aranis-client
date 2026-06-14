import NavbarTable from '@/app/admin/navbar/_components/NavbarTable';
import ClientTableWrapper from '@/components/common/wrapper/ClientTableWrapper';
import { Button } from '@/components/ui/button';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getNavbars } from '@/services/navbar/navbar';
import { SearchParams } from '@/types';
import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const NavbarAdminPage = async ({ searchParams }: SearchParams) => {
  const resolvedParams = await cleanSearchParams(searchParams);
  const params = { ...resolvedParams, sort: 'order' };

  const { data, meta } = await getNavbars(params);
  return (
    <>
      <ClientTableWrapper
        tableTitle="Navbar Menu"
        meta={meta}
        action={<Actions />}
      >
        <NavbarTable navbars={data} />
      </ClientTableWrapper>
    </>
  );
};

export default NavbarAdminPage;

const Actions = () => {
  return (
    <Link href="/admin/navbar/create">
      <Button>
        <Plus className="mr-2 h-4 w-4" /> Add Menu Item
      </Button>
    </Link>
  );
};

export const metadata: Metadata = {
  title: 'Navbar Menu | Admin Portal',
};

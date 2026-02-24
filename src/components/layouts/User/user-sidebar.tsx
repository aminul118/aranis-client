import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { IUser } from '@/types';
import Link from 'next/link';
import Logo from '../../../assets/Logo';
import Menu from './Menu';

const UserSidebar = ({ user }: { user: IUser }) => {
  return (
    <Sidebar collapsible="icon" className="bg-black! text-white!">
      {/* Header */}
      <SidebarHeader>
        <Link href="/user" className="py-4">
          <Logo />
        </Link>
      </SidebarHeader>
      <Separator className="bg-white/10" />
      <SidebarContent>
        {/* User menu — role filtering available but all items visible to USER */}
        <Menu role={user?.role} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default UserSidebar;

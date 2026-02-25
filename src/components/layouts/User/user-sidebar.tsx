import Logo from '@/components/common/Logo';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { IUser } from '@/types';
import Menu from './Menu';

const UserSidebar = async ({ user }: { user: IUser }) => {
  return (
    <Sidebar collapsible="icon" className="bg-black! text-white!">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-4">
          <Logo />
        </div>
      </SidebarHeader>
      <Separator className="bg-white/10" />
      <SidebarContent>
        <Menu role={user?.role} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default UserSidebar;

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

const AdminSidebar = ({ user }: { user: IUser }) => {
  return (
    <Sidebar collapsible="icon" className="bg-black! text-white!">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-4">
          <Logo className="origin-left scale-90" />
        </div>
      </SidebarHeader>
      <Separator className="bg-white/10" />
      <SidebarContent>
        {/* Sidebar Menu — passes user role for dynamic filtering */}
        <Menu user={user} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default AdminSidebar;

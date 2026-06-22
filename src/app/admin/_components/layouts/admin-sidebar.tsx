import Logo from '@/components/common/Logo';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import type { IUser } from '@/services/user/user.interface';
import Menu from './Menu';

const AdminSidebar = ({ user, logoUrl }: { user: IUser; logoUrl?: string }) => {
  return (
    <Sidebar collapsible="offcanvas" className="text-gray-900 text-white!">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-4">
          <Logo className="origin-left scale-90" logoUrl={logoUrl} />
        </div>
      </SidebarHeader>
      <Separator className="bg-gray-200 dark:bg-white/10" />
      <SidebarContent>
        {/* Sidebar Menu — passes user role for dynamic filtering */}
        <Menu user={user} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default AdminSidebar;

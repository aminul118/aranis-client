import { Separator } from '@/components/ui/separator';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';
import { getMe } from '@/services/user/users';
import Link from 'next/link';
import Logo from '../../../assets/Logo';
import DynamicMenu from '../shared/DynamicMenu';
import UserFooter from './UserFooter';
import { userSidebarMenu } from './user-menu';

const UserSidebar = async () => {
    const { data } = await getMe();
    return (
        <Sidebar collapsible="icon">
            {/* Header */}
            <SidebarHeader>
                <Link href="/user" className="py-4">
                    <Logo />
                </Link>
            </SidebarHeader>
            <Separator />
            <SidebarContent>
                {/* User menu — role filtering available but all items visible to USER */}
                <DynamicMenu menuGroups={userSidebarMenu} role={data?.role} />
            </SidebarContent>
            {/* Footer */}
            <SidebarFooter className="py-6">
                <Separator className="mb-2" />
                <UserFooter user={data} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
};

export default UserSidebar;

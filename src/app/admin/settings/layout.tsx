import SettingsSidebar from '@/components/modules/Admin/settings/SettingsSidebar';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Navigation */}
        <SettingsSidebar />

        {/* Main Content */}
        <main className="max-w-3xl flex-1">{children}</main>
      </div>
    </div>
  );
}

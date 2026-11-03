import { useAdminSettingsLogic } from "./hooks/useAdminSettingsLogic";
import { SettingsSidebar } from "./components/SettingsSidebar";
import { GeneralSettings } from "./components/GeneralSettings";
import { NotificationSettings } from "./components/NotificationSettings";
import { SecuritySettings } from "./components/SecuritySettings";

export function AdminSettings() {
  const {
    settings,
    setSettings,
    notifications,
    setNotifications,
    security,
    setSecurity,
    isLoading,
    isSaving,
    showPassword,
    setShowPassword,
    handleSaveAll,
  } = useAdminSettingsLogic();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <p className="text-[#6B7280]">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-white mb-2 text-3xl font-bold">Admin Settings</h1>
          <p className="text-white/90">Manage your store settings and preferences</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SettingsSidebar />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <GeneralSettings
              settings={settings}
              setSettings={setSettings}
              handleSaveAll={handleSaveAll}
              isSaving={isSaving}
              isLoading={isLoading}
            />

            <NotificationSettings
              notifications={notifications}
              setNotifications={setNotifications}
            />

            <SecuritySettings
              security={security}
              setSecurity={setSecurity}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

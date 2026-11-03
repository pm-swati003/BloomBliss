import { useState, useEffect } from "react";
import { useAdminSettings, useAdminSettingsUpdate } from "@/lib/api/hooks/useAdmin";
import { toast } from "sonner";

const defaultGeneral = {
  siteName: "Bloom & Bliss",
  siteEmail: "admin@bloomandbliss.com",
  supportEmail: "support@bloomandbliss.com",
  phone: "+1 (415) 555-0100",
  address: "123 Flower Street, San Francisco, CA 94102",
  shop_lat: null,
  shop_lng: null,
  currency: "INR",
  timezone: "Asia/Kolkata",
  language: "en",
};

const defaultNotifications = {
  newOrders: true,
  lowStock: true,
  newCustomers: true,
  customerReviews: true,
  systemUpdates: false,
};

const defaultSecurity = {
  twoFactor: false,
  sessionTimeout: "30",
  passwordExpiry: "90",
};

export function useAdminSettingsLogic() {
  const [showPassword, setShowPassword] = useState(false);
  const { data: serverSettings, isLoading } = useAdminSettings();
  const updateSettings = useAdminSettingsUpdate();

  const [settings, setSettings] = useState(defaultGeneral);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [security, setSecurity] = useState(defaultSecurity);

  useEffect(() => {
    if (serverSettings) {
      setSettings({ ...defaultGeneral, ...serverSettings.general });
      setNotifications({
        ...defaultNotifications,
        ...serverSettings.notifications,
      });
      setSecurity({ ...defaultSecurity, ...serverSettings.security });
    }
  }, [serverSettings]);

  const handleSaveAll = () => {
    updateSettings.mutate(
      { general: settings, notifications, security },
      {
        onSuccess: () => toast.success("Settings saved successfully"),
        onError: () => toast.error("Failed to save settings"),
      }
    );
  };

  return {
    settings,
    setSettings,
    notifications,
    setNotifications,
    security,
    setSecurity,
    isLoading,
    isSaving: updateSettings.isPending,
    showPassword,
    setShowPassword,
    handleSaveAll,
  };
}

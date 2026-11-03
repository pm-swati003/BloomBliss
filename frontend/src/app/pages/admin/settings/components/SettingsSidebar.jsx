import { Globe, Bell, Lock, Mail } from "lucide-react";

export function SettingsSidebar() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
      <nav className="space-y-2">
        <button className="w-full text-left px-4 py-3 rounded-lg bg-[#E91E8C] text-white transition-all duration-300">
          <Globe className="inline-block w-5 h-5 mr-3" />
          General Settings
        </button>
        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#FFF5F7] text-[#374151] transition-all duration-300">
          <Bell className="inline-block w-5 h-5 mr-3" />
          Notifications
        </button>
        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#FFF5F7] text-[#374151] transition-all duration-300">
          <Lock className="inline-block w-5 h-5 mr-3" />
          Security
        </button>
        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#FFF5F7] text-[#374151] transition-all duration-300">
          <Mail className="inline-block w-5 h-5 mr-3" />
          Email Settings
        </button>
      </nav>
    </div>
  );
}

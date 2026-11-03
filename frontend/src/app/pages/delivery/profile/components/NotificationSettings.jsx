import { Bell } from "lucide-react";

export function NotificationSettings({ notifications, setNotifications }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Bell className="w-6 h-6 text-[#E91E8C] mr-3" />
        <h2 className="text-[#1F2937] text-xl font-bold font-sans">Notification Preferences</h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
          <div>
            <h3 className="text-[#374151] font-medium mb-1">New Deliveries</h3>
            <p className="text-[#6B7280] text-sm">Get notified when new deliveries are assigned</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.newDeliveries}
              onChange={(e) => setNotifications({ ...notifications, newDeliveries: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E91E8C]"></div>
          </label>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
          <div>
            <h3 className="text-[#374151] font-medium mb-1">Order Updates</h3>
            <p className="text-[#6B7280] text-sm">Receive updates about order changes</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.orderUpdates}
              onChange={(e) => setNotifications({ ...notifications, orderUpdates: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E91E8C]"></div>
          </label>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <h3 className="text-[#374151] font-medium mb-1">Earnings Updates</h3>
            <p className="text-[#6B7280] text-sm">Get notified about your earnings</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.earnings}
              onChange={(e) => setNotifications({ ...notifications, earnings: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E91E8C]"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

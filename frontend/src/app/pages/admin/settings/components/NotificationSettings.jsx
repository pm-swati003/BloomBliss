import { Bell } from "lucide-react";

export function NotificationSettings({ notifications, setNotifications }) {
  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationItems = [
    {
      key: "newOrders",
      title: "New Orders",
      description: "Get notified when new orders are placed",
    },
    {
      key: "lowStock",
      title: "Low Stock Alerts",
      description: "Receive alerts when products are running low",
    },
    {
      key: "newCustomers",
      title: "New Customers",
      description: "Get notified when new customers register",
    },
    {
      key: "customerReviews",
      title: "Customer Reviews",
      description: "Receive notifications for new product reviews",
    },
    {
      key: "systemUpdates",
      title: "System Updates",
      description: "Get updates about system maintenance and features",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Bell className="w-6 h-6 text-[#E91E8C] mr-3" />
        <h2 className="text-[#1F2937] text-xl font-bold">Notification Preferences</h2>
      </div>

      <div className="space-y-4">
        {notificationItems.map((item, index) => (
          <div
            key={item.key}
            className={`flex items-center justify-between py-3 ${
              index !== notificationItems.length - 1 ? "border-b border-[#E5E7EB]" : ""
            }`}
          >
            <div>
              <h3 className="text-[#374151] font-medium mb-1">{item.title}</h3>
              <p className="text-[#6B7280] text-sm">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={() => toggleNotification(item.key)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E91E8C]"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

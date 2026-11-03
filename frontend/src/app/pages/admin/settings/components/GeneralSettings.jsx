import { Globe, Save } from "lucide-react";

export function GeneralSettings({ settings, setSettings, handleSaveAll, isSaving, isLoading }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Globe className="w-6 h-6 text-[#E91E8C] mr-3" />
        <h2 className="text-[#1F2937] text-xl font-bold">General Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#374151] mb-2 font-medium">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            />
          </div>
          <div>
            <label className="block text-[#374151] mb-2 font-medium">Site Email</label>
            <input
              type="email"
              value={settings.siteEmail}
              onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            />
          </div>
          <div>
            <label className="block text-[#374151] mb-2 font-medium">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            />
          </div>
          <div>
            <label className="block text-[#374151] mb-2 font-medium">Phone Number</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#374151] mb-2 font-medium">Business Address</label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#374151] mb-2 font-medium">
              Shop latitude (for order tracking map)
            </label>
            <input
              type="text"
              placeholder="e.g. 15.8497"
              value={settings.shop_lat ?? ""}
              onChange={(e) => {
                const v = e.target.value.trim();
                setSettings({
                  ...settings,
                  shop_lat: v === "" ? null : parseFloat(v) || null,
                });
              }}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            />
          </div>
          <div>
            <label className="block text-[#374151] mb-2 font-medium">
              Shop longitude (for order tracking map)
            </label>
            <input
              type="text"
              placeholder="e.g. 74.4977"
              value={settings.shop_lng ?? ""}
              onChange={(e) => {
                const v = e.target.value.trim();
                setSettings({
                  ...settings,
                  shop_lng: v === "" ? null : parseFloat(v) || null,
                });
              }}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            />
          </div>
        </div>
        <p className="text-[#6B7280] text-sm -mt-2">
          Optional. Used as the shop marker on the live tracking map. If left empty, the app will try to geocode your Business Address above.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#374151] mb-2 font-medium">Delivery Rate Per KM (₹)</label>
            <input
              type="number"
              min="0"
              value={settings.deliveryRatePerKm ?? 30}
              onChange={(e) => setSettings({ ...settings, deliveryRatePerKm: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[#374151] mb-2 font-medium">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            >
              <option value="INR">INR - Indian Rupee</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
          <div>
            <label className="block text-[#374151] mb-2 font-medium">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            >
              <option value="Asia/Kolkata">India (IST)</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/New_York">Eastern Time</option>
            </select>
          </div>
          <div>
            <label className="block text-[#374151] mb-2 font-medium">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving || isLoading}
          className="w-full md:w-auto px-6 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 font-medium mt-4"
        >
          <Save className="w-5 h-5" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

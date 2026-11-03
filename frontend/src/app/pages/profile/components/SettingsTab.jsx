import { Bell, Lock, Eye, EyeOff } from "lucide-react";

export function SettingsTab({
  notifications,
  setNotifications,
  showPassword,
  setShowPassword,
  passwordForm,
  setPasswordForm,
  handlePasswordUpdate,
  updatePasswordPending,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Bell className="w-6 h-6 text-[#E91E8C] mr-3" />
          <h2 className="text-2xl font-bold">Notification Preferences</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-[#1F2937]">Order Updates</h3>
              <p className="text-sm text-[#6B7280]">Get notified about your order status</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.orderUpdates}
                onChange={(e) => setNotifications({ ...notifications, orderUpdates: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#E5E7EB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E91E8C]"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-[#1F2937]">Promotions & Offers</h3>
              <p className="text-sm text-[#6B7280]">Receive exclusive deals and discounts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.promotions}
                onChange={(e) => setNotifications({ ...notifications, promotions: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#E5E7EB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E91E8C]"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-[#1F2937]">Newsletter</h3>
              <p className="text-sm text-[#6B7280]">Weekly flower care tips and inspiration</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.newsletter}
                onChange={(e) => setNotifications({ ...notifications, newsletter: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#E5E7EB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E91E8C]"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-bold text-[#1F2937]">SMS Notifications</h3>
              <p className="text-sm text-[#6B7280]">Text messages for delivery updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#E5E7EB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E91E8C]"></div>
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Lock className="w-6 h-6 text-[#E91E8C] mr-3" />
          <h2 className="text-2xl font-bold">Security</h2>
        </div>
        <form onSubmit={handlePasswordUpdate}>
          <label className="block text-[#374151] font-bold mb-3">Change Password</label>
          <div className="space-y-3">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Current Password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg pr-12 focus:border-[#E91E8C] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <input
              type="password"
              required
              minLength={8}
              placeholder="New Password"
              value={passwordForm.password}
              onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#E91E8C] outline-none"
            />
            <input
              type="password"
              required
              minLength={8}
              placeholder="Confirm New Password"
              value={passwordForm.password_confirmation}
              onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#E91E8C] outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={updatePasswordPending}
            className="mt-4 px-6 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] disabled:opacity-50"
          >
            {updatePasswordPending ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-red-200">
        <h2 className="text-red-600 text-2xl font-bold mb-4">Danger Zone</h2>
        <p className="text-[#6B7280] mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}

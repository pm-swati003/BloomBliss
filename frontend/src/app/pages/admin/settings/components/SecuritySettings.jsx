import { Shield, EyeOff, Eye } from "lucide-react";

export function SecuritySettings({ security, setSecurity, showPassword, setShowPassword }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Shield className="w-6 h-6 text-[#E91E8C] mr-3" />
        <h2 className="text-[#1F2937] text-xl font-bold">Security Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between py-4 border-b border-[#E5E7EB]">
          <div>
            <h3 className="text-[#374151] font-medium mb-1">Two-Factor Authentication</h3>
            <p className="text-[#6B7280] text-sm">
              Add an extra layer of security to your account
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={security.twoFactor}
              onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E91E8C]"></div>
          </label>
        </div>

        <div>
          <label className="block text-[#374151] font-medium mb-2">Change Password</label>
          <div className="space-y-3">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Current Password"
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#E91E8C] transition-colors duration-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            />
          </div>
          <button className="mt-4 px-6 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all duration-300 font-medium">
            Update Password
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E5E7EB]">
          <div>
            <label className="block text-[#374151] font-medium mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            />
          </div>
          <div>
            <label className="block text-[#374151] font-medium mb-2">
              Password Expiry (days)
            </label>
            <input
              type="number"
              value={security.passwordExpiry}
              onChange={(e) => setSecurity({ ...security, passwordExpiry: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Clock } from "lucide-react";

export function AvailabilitySettings({ availability, setAvailability }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Clock className="w-6 h-6 text-[#E91E8C] mr-3" />
        <h2 className="text-[#1F2937] text-xl font-bold font-sans">Availability Settings</h2>
      </div>
      <div className="flex items-center justify-between py-4 border-b border-[#E5E7EB]">
        <div>
          <h3 className="text-[#374151] font-medium mb-1">Currently Available</h3>
          <p className="text-[#6B7280] text-sm">
            {availability
              ? "You are available to receive new deliveries"
              : "You will not receive new delivery requests"}
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={availability}
            onChange={(e) => setAvailability(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E91E8C]"></div>
        </label>
      </div>
      <div className="mt-6">
        <h3 className="text-[#374151] font-medium mb-4">Working Hours</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Monday - Friday</span>
            <span className="text-[#374151] font-medium">9:00 AM - 6:00 PM</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Saturday</span>
            <span className="text-[#374151] font-medium">10:00 AM - 4:00 PM</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Sunday</span>
            <span className="text-[#374151] font-medium">Closed</span>
          </div>
        </div>
        <button className="mt-6 w-full px-4 py-3 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg hover:bg-[#E91E8C] hover:text-white transition-all duration-300 font-medium">
          Update Working Hours
        </button>
      </div>
    </div>
  );
}

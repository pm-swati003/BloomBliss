import { User, Package, MapPin, CreditCard, Settings, Gift } from "lucide-react";

export function ProfileSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
      <nav className="space-y-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
            activeTab === "profile" ? "bg-[#E91E8C] text-white" : "hover:bg-[#FFF5F7] text-[#374151]"
          }`}
        >
          <User className="inline-block w-5 h-5 mr-3" /> Profile Info
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
            activeTab === "orders" ? "bg-[#E91E8C] text-white" : "hover:bg-[#FFF5F7] text-[#374151]"
          }`}
        >
          <Package className="inline-block w-5 h-5 mr-3" /> Order History
        </button>
        <button
          onClick={() => setActiveTab("addresses")}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
            activeTab === "addresses" ? "bg-[#E91E8C] text-white" : "hover:bg-[#FFF5F7] text-[#374151]"
          }`}
        >
          <MapPin className="inline-block w-5 h-5 mr-3" /> Addresses
        </button>
        <button
          onClick={() => setActiveTab("payment")}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
            activeTab === "payment" ? "bg-[#E91E8C] text-white" : "hover:bg-[#FFF5F7] text-[#374151]"
          }`}
        >
          <CreditCard className="inline-block w-5 h-5 mr-3" /> Payment Methods
        </button>
        <button
          onClick={() => setActiveTab("perks")}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
            activeTab === "perks" ? "bg-[#E91E8C] text-white" : "hover:bg-[#FFF5F7] text-[#374151]"
          }`}
        >
          <Gift className="inline-block w-5 h-5 mr-3" /> Subscriber perks
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
            activeTab === "settings" ? "bg-[#E91E8C] text-white" : "hover:bg-[#FFF5F7] text-[#374151]"
          }`}
        >
          <Settings className="inline-block w-5 h-5 mr-3" /> Settings
        </button>
      </nav>
    </div>
  );
}
